---
layout: post
title: DCI in Rails
---

[This](/assets/arch/dci_interactions.zip) is a stripped version of Rails application to show why, where and how we may use Interactions. 
Generally, Interactions (and DCI by itself), is not a religion, but a handy tool to keep legacy 
codebase mantainable, to separate business actions for MVC codebase, to make both developers, 
managers and stakeholders speak in the same language.
This is the part of documentation stack I made for an existing project which is still active and has
up to 50M views monthly.

# Interactions

Interactions are the way to improve the messy MVC logic, by extracting business-actions into a separated Ruby classes, 
following name conventions, combining DCI and DDD ideas to make application development more agile.

[!] Interactions are the place for business logic.

## Basic Ideas

**Controllers** should not change **Models** attributes directly (but not always, but most of the time - read clarifications below), instead they should call Interaction methods to perform business actions. No business logic should be placed in **Models**, **Models** should implement simple **ORM**, and should provide data consistency.

```js
      +-------------+
      |             |
   +--+---+  +------v-----+
   | View |  | Controller <--------+
   +------+  +------------+        |
                                   |
   +-------------+                 |
   | Model (Data)|<--+             |
   +-----+-------+   |     +-------v-----+
         |     ^     |     | Interaction |
      +--v--+  +--+  |     +-------------+
      | ORM |     |  |             ^  +
      +--+--+     |  +-------------+  |
         |        |                   |
    +----v-----+  |                   |
    | Database |  |   +----------+    |
    +----------+  |   |Business  |    |
                  +---+Validators|<---+
                      +----------+
```

These are examples of business logic that should find its place in Interactions:

* When admin invites a sub-account to join sub account
* When we need to add some user's acctio to log
* When new process of Contacts import started, and we need to add a new Event
* When sub-account confirms his join
* When Contact receive a new value for Open/Click Rate attribute
* When Email Message sent to Test


[!] Interactions are little bit more than just a pieces of code. Interactions are the 
way to make you think like a user, of suit. It is the way to talk on the same language 
and use same business-oriented terms, instead of programmer's mambo-jambo. As the final 
result you'll have stronger and less blured informational channel between all participants.

These are examples of data consistency validations and logic, that should be placed in Models:

* Message must have a reference to Sub-account.
* Account status can have only one of predefined values.
* When new Message, has updated Link Open rate (a simple data denormalization).

## Just a good old Ruby class
**Interaction** is a class responsible for a set of related business methods. It takes subject(s) in a constructor, all the method-related parameters are passed as method arguments.

### Class Naming
Interaction class name has following structure:

`<Subject><ActionsGroup>Interaction`

* `<Subject>` is a name of a business object being manipulated, usually (but not necessarily ActiveRecord model), examples: Message, SubAccount, Account.
* `<ActionsGroup>` is a noun describing scope of actions implemented in this Interaction. It is stated in business terms, do not use technical and catch-all words.
* `Interaction` is a mandatory suffix for all Interactions to devide them from other Ruby classes.

### Actions
Action groups may include:

* `Creation` - create new instance
* `Update` - update of visible object parameters that can be explicitly modified by user, such as title, description, email, time zone, etc. But it doesn't handle update of internal parameters like status, various flags, etc.
* `<your_action_name>` (for example, `Logger`) - feel free to use a resonable action name depending of situation. For eample: `UserLoggerInteraction` to store date connected with User's information (agent, IP...) during logging in

### Examples

**Correct**

```ruby
SubAccountCreationInteraction # methods for new developer creation or application
```

**Incorrect**

* `SubAccountCreation` - No interaction suffix
* `MessageReviewingAction` - Where possible use nouns instead of -ing form and stick with Interaction as the suffix
* `UsersInteraction` - No action group defined

### Method Naming
**Interaction** method name describes single action it performs in business terms. Again, be specific and don't use technical and catch-all words.
Do not use bang in method names, we all know that Interaction raise errors in case of failed validation, so there is no reason to create unnecessary noise.
Do not repeat subject name in method name, e.g. use `MessageTestInteraction#send` instead of `MessageTestInteraction#send_test_message` since it's already clear that we are taking action on Message to test it.

### Interaction Class
All interactions inherit from `BaseInteraction` class. Base interaction has two responsibilities:

* Provide validation helpers (see next section).
* Get optional performer object into constructor.

Each interaction accepts performer (Role object) - which performs this action. By default it's `nil`, and it means that this actions is treated, as performed by system and ignoring authorization. If you create a custom constructor in your interaction, don't forget to accept performer and call `super` with it.

Example:

```ruby
class AdminCreationInteraction < BaseInteraction
  APPLICATION_ATTRIBUTES = [
    :email, :full_name, :about
    ...
    ]
  # @param attributes [Hash]
  # @return Admin
  def create(attributes)
    Admin.new(attributes.slice(*APPLICATION_ATTRIBUTES)).tap do |admin|
      # actions you need to do with Admin before save,
      # like assign attributes, calculations and so on.
      # After this, actual object save happens:
      admin.save!
      # After save you can perform additional actions you previously had,
      # for example, in observers
      NotificationInteraction.notify_admin_created(admin, 'New admin created!', Time.zone.now)
    end
  rescue ActiveRecord::RecordInvalid => e
    raise InteractionValidationError.new(e.record)
  end
end
```

### Validations
In case of validation error interaction raises InteractionValidationError or specific error inherited from this one.
There is a number of helpers (`validate!`, `validate_presence!`, etc.) to check input parameters and initial object(s) state. See InteractionValidationHelpers module for details.
To validate final object(s) state, use bang versions of model update methods (`update_attributes!`, `save!`) and catch `ActiveRecord::RecordInvalid`.
As for error messages, they should start with capital letter and end without punctuation.

Thus structure of a typical interaction method is:

```ruby
def <action_name>(...)
  validate! ...
  validate! ...

  # perform main action: update subject object(s) state with bang methods (e.g. save!)

  # perform additional operations (send notifications, call other interactions, etc.)

rescue ActiveRecord::RecordInvalid => e
  raise ValidationError.new(e.record)
end
```

You can collect several validation errors to send at once using validate_all! method with a block. Inside the block you can use all the same validations.
You can combine groupped an ungroupped validations. For example, common case is to split validations in two parts:
Initial state validation (can requested transition be done with this object at all). If this validation fails there is no reason to show other validation messages, because user can't fix it anyway.
Submitted data validation (new fields, new state validation) - these validations should be groupped, because it is much more usable to show all form validation errors at once.

**Example:**

```ruby
def approve(attributes)
  # initшal state validation
  validate! object.status == :pending, message: 'Object has to be pending'

  # instead of validating attributes passed, you can assign them to model to perform
  # type conversion, etc. and then validate model attributes
  object.as_system.attributes = attributes.slice(*ALLOWED_ATTRIBUTES)

  # data validations
  validate_all! do
    validate_presence! attributes[:comment], message: {comment: 'You have to specify a comment'}
    validate! object.date >= Time.zone.today, message: {date: "Can't be in the past"}
    validate_model! object
  end

  # ...
end
```

**Specs**

Spec has following structure:

```ruby
describe <InteractionClass> do
  describe "#<action_name>" do
    # specs for success path

    context "validations" do
      context "<error_case_1>" do
        # specs for validation errors (usually included via shared examples)
      end

      # etc.
    end
  end
end
```

**Controller Usage**

Example:

```ruby
def reject
  FooInteraction.new(@foo).reject(params[:foo])
  render json: {redirect: foo_path}
rescue Interaction::ValidationError => e
  render json: {errors: e.errors}
end
```