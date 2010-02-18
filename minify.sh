#!/bin/sh
cd src
cat namespace.js hash_table.js byte_array.js tcp_socket_ext.js simple_sgs_protocol.js client_channel.js message_filter.js sgs_event.js simple_client.js | jsmin > ../example/red_dwarf.js
