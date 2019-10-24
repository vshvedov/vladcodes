---
layout: post
title: Automated testing
---

## Introduction

Automated tests are an integral part of any modern application: they allow to minify expenses of support, refactoring and development, leaving more resources to the new features development, to add new developers into the stack faster, and to create robust software products.
By itself, as automated tests are nothing more than a code used to automate manual actions, they must consist of a clean good readable code. This means that all of the good coding practices are relevant for the automated tests as well, and sometimes are even more important in the test code than in production code. In particular, good tests are:

* Maintainable
* Readable
* Have single responsibility (i.e. testing only a single business rule)
* Isolated
* Deterministic

## General automated testing best practices 

There are a number of simple best practices of achieving the goal, when automated tests go together with a feature development (or before it, if we are talking about TDD/BDD), helping a developer and a team do things faster than without tests:
In order to achieve both maintainability and readability of the tests, they must verify Business Functionality, and they must not rely on any implementation details. If your tests rely on a specific implementation details, then once these details are changed, your tests will break.

### Scenarios

Good tests must describe a simple scenario from the perspective of the user. A single test can describe a scenario that spans different users (roles) in different times. You have to try to avoid a situation when you’re testing technical aspects of the system’s state, if this is not a goal of the test. You have to make automated tests as atomic as possible, always paying attention on potential randomness in order of tests execution.
To ensure that the tests are readable and reflect user scenario, always write your tests in a Top to the Bottom manner. Focus on what you want to test rather then how; try hard to avoid duplications; DRY your code as the second round of self review before the pull request. However, if you really feel that drying is going to take too long, leave it as is and ask for help with a TODO comment.
Tests should create all data or environment conditions that are relevant to them at the beginning, and clean them up afterwards. While automated tests are nothing more than a “code plus testing” framework, they should always go through a code review. Tests should not depend on anything outside of them that may change. This includes the order of performing of the tests, date and time, random generator – keep in mind random execution, use specific techniques to freeze the time, and so on.

## Rspec best practices 

Rspec is a great tool in the behavior-driven development, and we need to fully use its potential, to make the automated test’s code reliable and maintainable. Here is the number of general guidelines for your Rspec specs: 
Be clear about what method you are describing. For instance, use the Ruby documentation convention of . (or ::) when referring to a class method's name, and # when referring to an instance method's name.

* Always use contexts: they are a powerful method of making your tests clear and well organized. In the long term, this practice will keep tests easy to read.
* Keep descriptions short and easily readable in English.
* You always have to create single-expectations specs.
* Test all possible cases, starting with edge cases for minimum/maximum, or false/true, values (so call 0/1 testing).
* Keep guard always turned on.
* Use pseudo-random data (like faker/ffaker Ruby gems) instead of lame test input like: 'a@a.com', '123123', 'John Doe'

More specific guidelines are highly connected with Rspec framework itself, they are always a point for discussion during code reviews.
