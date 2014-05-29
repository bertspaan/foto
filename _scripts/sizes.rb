#!/usr/bin/ruby

# MacBook: 1280 x 800
# 24" Samsung: 1920 x 1200
mkdir sizes

# Google Plus heeft 193*133 bij albumlijst
# en 329x218 in album

mkdir sizes/120
mogrify -path sizes/120 -resize x120 -quality 60 -format jpg *.jpg

mkdir sizes/240
mogrify -path sizes/240 -resize x240 -quality 60 -format jpg *.jpg


mkdir sizes/800
mogrify -path sizes/800 -resize 1280x800 -quality 90 -format jpg *.jpg


mkdir sizes/1200
mogrify -path sizes/1200 -resize 1920x1200 -quality 90 -format jpg *.jpg

