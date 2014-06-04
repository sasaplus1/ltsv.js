#!/usr/bin/env make -f

.DEFAULT_GOAL := all

cat := $(if $(OS), type, cat)

source_files := formatter.js parser.js utility.js validator.js export.js
concat_files := $(addprefix lib/, _intro.js $(source_files) _outro.js)

r_file := ltsv.min.js
t_file := test/ltsv.js

flags := --comments -m -c 'pure_funcs=["export_", "require_"]' -r 'ltsv'

r_flags := $(flags) -d 'process=void 0, Mocha=void 0' -o $(r_file)
t_flags := $(flags) -d 'process="true", Mocha="ltsv"' -o $(t_file)

.PHONY: all
all:
	@echo 'please execute `npm run`'

.PHONY: clean
clean:
	@$(RM) $(r_file) $(t_file)

.PHONY: release-build
release-build:
	@$(cat) $(concat_files) | uglifyjs $(r_flags)

.PHONY: test-build
test-build:
	@$(cat) $(concat_files) | uglifyjs $(t_flags)
