CAT := $(if $(OS), type, cat)

UGLIFYJSC := $(shell npm bin)/uglifyjs
UGLIFYJSFLAGS := --comments -m -c 'pure_funcs=["export_", "require_"]' -r 'ltsv'

MINI := ltsv.min.js
TEST := test/ltsv.js

SRCS := $(addprefix lib/, \
  _intro.js \
  formatter.js \
  parser.js \
  utility.js \
  validator.js \
  export.js \
  _outro.js \
)

.PHONY: all
all: $(MINI) $(TEST)

.PHONY: clean
clean:
	@$(RM) $(MINI) $(TEST)

$(MINI): UGLIFYJSFLAGS += -d 'process=void 0, Mocha=void 0'
$(MINI): $(SRCS)
	@$(CAT) $^ | $(UGLIFYJSC) $(UGLIFYJSFLAGS) -o $@

$(TEST): UGLIFYJSFLAGS += -d 'process=true, Mocha=true'
$(TEST): $(SRCS)
	@$(CAT) $^ | $(UGLIFYJSC) $(UGLIFYJSFLAGS) -o $@
