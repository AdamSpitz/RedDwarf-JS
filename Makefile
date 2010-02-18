build_dir := RedDwarf-JS

js_files := $(addprefix src/, namespace.js hash_table.js byte_array.js tcp_socket_ext.js simple_sgs_protocol.js client_channel.js message_filter.js sgs_event.js simple_client.js)

minified_js_file := $(build_dir)/red_dwarf.js

zip_file := $(build_dir).zip

other_files := example.html orbited.cfg README.markdown LICENSE.txt

$(build_dir):
	mkdir $(build_dir)

$(minified_js_file): $(js_files) $(build_dir)
	cat $(js_files) | jsmin > $(minified_js_file)

$(zip_file): $(build_dir) $(minified_js_file) $(other_files)
	cp  $(other_files) $(build_dir)
	zip -r $(zip_file) $(build_dir)

clean:
	rm -r $(build_dir) $(zip_file)

dist: $(zip_file)

all: dist
