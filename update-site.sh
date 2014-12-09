#!/bin/sh

rsync -rulve 'ssh' --delete --exclude="*.sublime-*" --exclude="*.subl*.tmp" ./* amv-ph34r.com:ochl-pres/
