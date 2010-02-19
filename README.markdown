# RedDwarf-JS

RedDwarf-JS is a Javascript client library for [RedDwarf](http://reddwarf.sourceforge.net/) (formerly [Project Darkstar](http://projectdarkstar.com/)).


## Installation

1. Install [Twisted](http://twistedmatrix.com/trac/wiki/Downloads). (Requires [Python](http://python.org/).)
2. Install [Orbited](http://orbited.org/wiki/Installation). (On my Macbook, all I had to do was use Python's easy_install facility: `easy_install orbited` and `easy_install simplejson`.)
3. Download [RedDwarf Server](http://reddwarf.sourceforge.net/). (To run it, you'll need Java 6. On a 64-bit Mac you can get it via Software Update.)


## Running the example client

1. Get a command prompt in the RedDwarf-JS directory and then run `orbited`
2. Get a command prompt in the directory where you downloaded RedDwarf Server and start the SwordWorld (or HelloChannels or whatever) server by running `java -jar bin/sgs-boot.jar tutorial/conf/SwordWorld.boot`
3. Point your web browser at [http://localhost:9000/example/example.html](http://localhost:9000/example/example.html)


## Credits

This is just a port of the [Darkstar-as3](http://code.google.com/p/darkstar-as3/) code over to Javascript. Thanks go to the people who wrote that, and the whole Project Darkstar/RedDwarf team. (Though if it doesn't work, it's probably my fault - it's very possible that I didn't port the code quite right.)


## Disclaimer

I don't know much about RedDwarf, or about WebSockets or Orbited. I don't promise that this code will work for you. I've tried it out with the HelloChannels and SwordWorld projects, on a few different browsers (Safari and Firefox and Chrome on my Macbook, and IE8 and Chrome on Windows XP). Please let me know if you find bugs or would like to make a suggestion or a contribution.


## License

Like [Darkstar-as3](http://code.google.com/p/darkstar-as3/), this project is under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
