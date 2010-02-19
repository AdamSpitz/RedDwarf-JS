build_dir := RedDwarf-JS

js_files := $(addprefix src/, namespace.js hash_table.js byte_array.js tcp_socket_ext.js simple_sgs_protocol.js client_channel.js message_filter.js sgs_event.js simple_client.js)

minified_js_file := red_dwarf.js
unminified_js_file := red_dwarf_readable.js

zip_file := $(build_dir).zip

files_to_release := example.html orbited.cfg README.markdown LICENSE.txt $(minified_js_file)

$(minified_js_file): $(js_files)
	cat $(js_files) | jsmin > $(minified_js_file)

$(unminified_js_file): $(js_files)
	cat $(js_files) > $(unminified_js_file)

$(build_dir):
	mkdir $(build_dir)

$(zip_file): $(build_dir) $(files_to_release)
	cp  $(files_to_release) $(build_dir)
	zip -r $(zip_file) $(build_dir)

readable: $(unminified_js_file)

clean:
	rm -r $(build_dir) $(zip_file) $(minified_js_file) $(unminified_js_file)

dist: $(zip_file)

all: dist
