require 'rubygems'
require 'sinatra'
require "RMagick"
require "active_support"
require 'zip/zip'
require 'zip/zipfilesystem'

set :public, "public"
set :views, "views"

configure :production do
end

# http://github.com/henrik/slugalizer/blob/master/slugalizer.rb
module Sluggify
  extend self
  
  SEPARATORS = %w[- _ +]
  
  def sluggify(separator = "-")
    unless SEPARATORS.include?(separator)
      raise "Word separator must be one of #{SEPARATORS}"
    end
    re_separator = Regexp.escape(separator)
    result = decompose
    result.gsub!(/[^\x00-\x7F]+/, '')                      # Remove non-ASCII (e.g. diacritics).
    result.gsub!(/[^a-z0-9\-_\+]+/i, separator)            # Turn non-slug chars into the separator.
    result.gsub!(/#{re_separator}{2,}/, separator)         # No more than one of the separator in a row.
    result.gsub!(/^#{re_separator}|#{re_separator}$/, '')  # Remove leading/trailing separator.
    result.downcase!
    result
  end
  
private
 
  def decompose
    if defined?(ActiveSupport::Multibyte::Handlers)  # Active Support <2.2
      ActiveSupport::Multibyte::Handlers::UTF8Handler.normalize(self, :kd).to_s
    else  # ActiveSupport 2.2+
      ActiveSupport::Multibyte::Chars.new(self).normalize(:kd).to_s
    end
  end
  
end

class String
  include Sluggify
end

def file_name(name)
  ext = File.extname(name)
  "#{Time.now.to_s}-#{name}-#{rand(10000).to_s}".sluggify + ext
end

def crop(file, sizes)
  result           = []
  image            = Magick::Image.read(file[:tempfile].path).first
  sizes.each do |size|
    x              = size.has_key?("x") ? size["x"].to_i : 0
    y              = size.has_key?("y") ? size["y"].to_i : 0
    width          = size.has_key?("width") ? size["width"].to_i : image.columns
    height         = size.has_key?("height") ? size["height"].to_i : image.rows
    result         << image.crop(x, y, width, height)
  end
  result
end

def download_zip(files, sizes)
  
  return [] if files.nil? || files.empty? || sizes.nil? || sizes.empty?
  
  files.each do |file|
    file[:results] = crop(file, sizes)
  end
  
  file_name = params["folder"] || "cropify-images.zip"
  t = Tempfile.new("cropify-tempfiles-#{Time.now}-#{rand(10000)}")

  Zip::ZipOutputStream.open(t.path) do |z|
    files.each do |file|
      ext = File.extname(file[:filename])
      basename = File.basename(file[:filename])
      file[:results].each do |cropped|
        z.put_next_entry("#{basename}-#{cropped.columns}x#{cropped.rows}#{ext}")
        z.print cropped.to_blob # IO.read(file[:tempfile].path)
      end
    end
  end
  
  send_file t.path, :type => 'application/zip', :disposition => 'attachment', :filename => file_name
  t.close
end

get "/" do
  options = {}
  locals = {"output" => ""}
  options[:locals] = locals
  haml :index, options
end

post "/" do
  zip = download_zip(params["files"], params["sizes"])
end