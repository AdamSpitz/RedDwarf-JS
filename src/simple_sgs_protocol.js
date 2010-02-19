/*
http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2010 Adam Spitz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

RedDwarf.SimpleProtocol = {
  MAX_MESSAGE_LENGTH: 65535,
  MAX_PAYLOAD_LENGTH: 65532,
  VERSION: 0x04,
  LOGIN_REQUEST: 0x10,
  LOGIN_SUCCESS: 0x11,
  LOGIN_FAILURE: 0x12,
  LOGIN_REDIRECT: 0x13,
  RECONNECT_REQUEST: 0x20,
  RECONNECT_SUCCESS: 0x21,
  RECONNECT_FAILURE: 0x22,
  SESSION_MESSAGE: 0x30,
  LOGOUT_REQUEST: 0x40,
  LOGOUT_SUCCESS: 0x41,
  CHANNEL_JOIN: 0x50,
  CHANNEL_LEAVE: 0x51,
  CHANNEL_MESSAGE: 0x52
};
