# Thank you for contributing to Blocker!

We are truly grateful that you are interested in contributing to this project. Your contributions help make this project better for everyone.

This document is a guideline for contributing to our project.

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Pull Request Process](#pull-request-process)
- [Styleguides](#styleguides)
- [Code of Conduct](#code-of-conduct)

## How Can I Contribute?

There are many ways to contribute to the project beyond writing code.

- Fixing typos or improving the documentation
- Reporting bugs or suggesting new features
- Answering questions in the Issues section

## Reporting Bugs

If you find a bug, please report it in the Issues tab.
Each issue should be created in the **Issues tab of the corresponding repository**.

When creating a bug report, including the following details will be very helpful for us to resolve the issue:

- Your operating system and browser version
- Specific steps to reproduce the bug
- What you expected to happen vs. what actually happened
- A screenshot (if possible)

## Suggesting Enhancements

If you have a new idea, feel free to suggest it in the Issues tab.
Each enhancement request should also be created in the **Issues tab of the corresponding repository**.

Before submitting, it's a good idea to check if a similar suggestion has already been made.


## Pull Request Process

1. Create a new branch from the `main` branch. (e.g., `git checkout -b feature/new-amazing-feature` or `bugfix/fix-that-bug`)
2. Make your changes and commit them. Please follow the [Commit Message Conventions](#commit-message-conventions).
3. Push your branch to your forked repository.
4. Open a Pull Request (PR) from your fork to the original repository.
5. Make sure the PR title and description are clear and easy for others to understand.

> ⚠️ Before submitting a Pull Request, please first **create an Issue**, then create a branch for that Issue, and finally open a PR targeting the `main` branch.

## Styleguides

### Commit Message Conventions

- Commit messages should follow the `type: subject` format. (e.g., `Feat: Add user authentication feature`)
- Types can include:

| Type | Description |
| --- | --- |
| **Feat** | Add a new feature |
| **Fix** | Fix a bug |
| **Docs** | Documentation changes |
| **Style** | Code formatting, missing semicolons, etc. (no code logic changes) |
| **Refactor** | Code refactoring |
| **Test** | Add or update tests |
| **Chore** | Changes to build process, package manager, or other miscellaneous tasks |
| **Design** | UI/UX design changes such as CSS updates |
| **Comment** | Add or update comments |
| **Rename** | Rename files or folders only |
| **Remove** | Remove files only |
| **!BREAKING CHANGE** | Major API changes |
| **!HOTFIX** | Critical hotfix for severe bugs |

Commit messages should follow these conventions, but uppercase/lowercase is **not strictly enforced**.

### Code Style
- This project follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- We use [Prettier](https://prettier.io/) for consistent code formatting.
- Please run the linter and formatter before committing your changes.

## Code of Conduct

Our project aims to be a safe and respectful environment for all participants. Before contributing, please read and adhere to our [Code of Conduct]([./CODE_OF_CONDUCT.md](https://github.com/HSU-Blocker/.github/blob/main/CODE_OF_CONDUCT.md)).
