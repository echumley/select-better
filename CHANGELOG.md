# Changelog

All notable changes to the **select-better** extension will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2025-07-20

### Added

- Initial release of `select-better`
- Smart selection for:
  - URLs (including Markdown-wrapped links)
  - Emails
  - Localhost and IPv4 URLs
  - Variable-style identifiers with `_` and `-`
- Fallback to extended word selection when no match is found
- Mac and Windows keybindings included

## [0.1.1] - 2025-07-24

### Fixed
- Improved handling of `mailto:` links:
  - Fixed edge case where selections would include trailing characters like parentheses or angle brackets.
  - Better parsing of `mailto:` addresses in HTML attributes and text blocks.
  - Now supports `mailto:` URIs with query strings (e.g., `?subject=...`) without breaking selection.

### Notes
- This patch improves reliability when selecting email links and enhances consistency with URL behavior.

---

## [Unreleased]

- Nothing yet 🚀