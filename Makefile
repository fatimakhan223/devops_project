# Makefile.starter — skeleton for Lab 02, Task 4 (ASSESSED).
#
# Rename this to  Makefile  and complete every TODO.
# Requirements are listed in Section 4.1 of the lab manual.
#
#     cp Makefile.starter Makefile
#     nano Makefile
#
# EVERY recipe line below must start with a real TAB, not spaces.
# Check yours with:  cat -A Makefile     (a tab shows as ^I)

SRC_DIR := src
OUT_DIR := out

# TODO 1: set SOURCES to every .txt file in $(SRC_DIR), using $(wildcard).
SOURCES := $(wildcard $(SRC_DIR)/*.md)

# TODO 2: set OUTPUTS to the matching paths under $(OUT_DIR), using $(patsubst).
OUTPUTS := $(patsubst $(SRC_DIR)/%.md,$(OUT_DIR)/%.html,$(SOURCES))
node_modules: package-lock.json
	npm ci
	@touch node_modules

deps: node_modules ## install exactly what the lock file says
$(OUT_DIR)/%.html: $(SRC_DIR)/%.md package-lock.json | $(OUT_DIR) node_modules
	@echo " BUILD $< -> $@"
	@npm run --silent build -- $< $@

test: build ## run the test suite against what was built
	@npm test --silent

# TODO 3: list every action target here so make never mistakes one for a file.
.PHONY: all check build test clean ci deps

# The first target in the file is what a bare `make` runs.
all: test

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

# TODO 4: the pattern rule. Announce the file with @echo, then convert it.
#         Use $< for the input and $@ for the output — no filenames by hand.
#         Keep the order-only prerequisite  | $(OUT_DIR)  exactly as it is.

# TODO 5: check — exit non-zero with a clear message when $(SRC_DIR) is
#         missing or holds no .txt files; otherwise report how many were
#         found. Hint: `test -d`, `$(words $(SOURCES))`, and remember that
#         each recipe line runs in its own shell.
check:
	@if [ ! -d "$(SRC_DIR)" ] || [ -z "$(SOURCES)" ]; then \
		echo "ERROR: no .md files found in $(SRC_DIR)"; \
		exit 1; \
	else \
		echo "Found $(words $(SOURCES)) source files"; \
fi

# The whole build stage. Nothing to add here — this line is the lesson.
build: $(OUTPUTS)

# TODO 6: test — depend on build, then fail if any output still contains a
#         lowercase letter. A multi-line if needs a backslash on every line
#         but the last. Print TEST PASSED on success.

package: test ## produce the versioned artifact
	npm pack

clean: ## remove all generated files
	rm -rf $(OUT_DIR) *.tgz

ci: clean deps check test package ## the build server entry point
