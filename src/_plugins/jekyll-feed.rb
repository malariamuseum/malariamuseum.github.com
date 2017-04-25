require "jekyll"
require "fileutils"
require_relative "./jekyll-feed/generator"

module JekyllFeed
  require_relative          "jekyll-feed/meta-tag"
  require_relative 			"jekyll-feed/page-without-a-file.rb"
end

Liquid::Template.register_tag "feed_meta", JekyllFeed::MetaTag
