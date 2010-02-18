# RedDwarf-JS

RedDwarf-JS is a Javascript client library for [RedDwarf](http://reddwarf.sourceforge.net/) (formerly [Project Darkstar](http://projectdarkstar.com/)).


## Installation

1. Install [Twisted](http://twistedmatrix.com/trac/wiki/Downloads).
2. Install [Orbited](http://orbited.org/wiki/Installation). (On my Macbook, all I had to do was `easy_install orbited` and `easy_install simplejson`.)
3. Make sure you've got Java 6. (On a 64-bit Mac you can do it via Software Update.)
4. Download [RedDwarf Server](http://reddwarf.sourceforge.net/).


## Running the example client

1. Get a command prompt in the RedDwarf-JS directory and then run `orbited`
2. Get a command prompt in the directory where you downloaded RedDwarf Server and start it by running `java -jar bin/sgs-boot.jar tutorial/conf/SwordWorld.boot`
3. Point your web browser at [http://localhost:9000/example/example.html](http://localhost:9000/example/example.html)


## Credits

I hardly did anything. I basically just ported the [Darkstar-as3](http://code.google.com/p/darkstar-as3/) code over to Javascript. Thanks go to those guys, and the whole Project Darkstar/RedDwarf team. (Blame goes to me - I'm pretty sure I didn't port the code quite right.)


## Disclaimer

I don't know anything about RedDwarf, or about WebSockets or Orbited. I don't promise that this code will work for you. I haven't tried it out on different platforms. All I know is that it seems to work for me on my machine. Please let me know if you find bugs or would like to make a suggestion or a contribution.


## Technical stuff

In the long run, hopefully we'll be able to use some sort of official standardized WebSockets thing; for now, we're using [Orbited](http://orbited.org).
