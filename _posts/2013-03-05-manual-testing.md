---
layout: post
title: Manual testing
---

> There are five main guidelines for manual testing. Each supplied with several examples. Examples, of course, can't cover all the possible scenarios, so try to follow general rules, use common sense, and feel free to add examples to this list.

* 1. **Sanity checks**

First, you need to test through the browser every single line of code you created, edited, or removed. Even if you edited a typo in a string constant, find a place in UI where it is rendered and check it. Make sure to test everything well, mind corner cases and user grants. When you create/change rendering of the list of users, messages or any other list, make sure pagination works, make sure the page renders correctly and shows a meaningful message for the empty list. When you create/edit action for stuff, the rule of thumb is to test it with a role other than admin: since admin has all grants by default, it's a common mistake to forget to add abilities for other roles. When testing Ajax response, or anything that is dynamically rendered with js, don't forget to reload the page to make sure it persisted correctly, and backend renders the same data. After reloading double-check places where you output or use user input: these places must sanitize strings, account for long strings, empty values, long words without spaces, line breaks and other corner cases for forms. Make sure to test different select/checkbox options, it's not enough to go with defaults. Always remember about flash notifications: users have to know what is going on after their actions.

* 2. **Negative scenarios**

Always test negative scenarios: validation errors should be correctly rendered with meaningful messages, clearly readable in English. Access should be reasonably restricted, don't forget about non-UI scenarios, and restrictions about URL could be manually pasted. Don't forget we may not always have only GET from users, test negative scenarios (when users do `PUT`, `DELETE` and so on) too.

* 3. **Inderect changes**

Most important is to test functionality that you haven't changed directly, but which reuses the same code. It is needed to make sure there is no regression issues. If you edit business logic, model method, scope, etc., find all usages through the project and open all the pages, and perform all the actions that use changed method. If you edit partial, find all the uses of this partial and make sure all these pages or responses render without problems. If you edit controller/view that is being used by several roles (even if your functionality relates to one role), check actions of this controller with each role, make sure there are no errors, that all required functionality is present, and that no partials/buttons from other roles have been rendered by mistake. If you edit CSS class, make sure all uses of this class are rendered as expected.

* 4. **Environments differences**

Mind the difference in development and production environments. Something that works in development might break with production config. If you edit assets, make sure rake assets:precompile runs without errors. If you add migrations, make sure they run in both directions and, if you make several migrations, they can be run all at once. Rails’ assets pipeline could be your friend, or some small CSS change could make the whole application inaccessible in Production.

* 5. **More sanity checks**

Remember, red specs help you discover some of these problems much faster, but green specs don't guarantee that everything is perfect. That's why we absolutely need manual testing combined with automated tests. Keep guard running all the time to make local continuous testing before pull-requesting.

> And rule zero (to rule them all, and in the darkness bind them) is: when doing manual testing, always think of what you are doing; because, while we have rspec/unit tests and Cucumber for automated tests, nothing can replace testing made by a developer.
