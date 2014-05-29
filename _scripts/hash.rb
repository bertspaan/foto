#!/usr/bin/ruby

require 'digest/sha1'

puts Digest::SHA1.hexdigest("#{Time.now.to_i}")