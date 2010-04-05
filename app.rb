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

module Cropify
  class Image
    attr_accessor :width, :height, :name, :type, :ext, :quality, :gravity, :content
    
    def initialize(attributes = {})
      attributes.each {|k,v| self.send "#{k}=", v} unless attributes.nil?
    end
    
    def detailed_name
      "#{name}-#{width}wx#{height}hx#{quality}q#{ext}"
    end
    
    def inspect
      "#<Cropify:Image @detailed_name=#{self.detailed_name.inspect} @width=#{self.width.to_s.inspect} @height=#{self.height.to_s.inspect}/>"
    end
  end
  
  def self.crop(file, sizes)
    result           = []
    image            = Magick::Image.read(file[:tempfile].path).first
    sizes.each do |size|
      scale_mode     = size["scale_mode"]
      quality        = [size["quality"].to_i, 100].min
      gravity_type   = "Magick::#{size["gravity_type"].camelize}Gravity".constantize if size["gravity_type"].downcase != "none"
      x              = size.has_key?("x") ? size["x"].to_i : 0
      y              = size.has_key?("y") ? size["y"].to_i : 0
      width          = size.has_key?("width") ? size["width"].to_i : image.columns
      height         = size.has_key?("height") ? size["height"].to_i : image.rows
      processed      = nil
      if scale_mode == "chop"
        if gravity_type
          processed  = image.crop(gravity_type, x, y, width, height)
        else
          processed  = image.crop(x, y, width, height)
        end
      elsif scale_mode == "fit"
        processed    = image.resize_to_fit(width, height)
      else # fill
        if gravity_type
          processed  = image.resize_to_fill(width, height, gravity_type)
        else
          processed  = image.resize_to_fill(width, height)
        end
      end
      result << Cropify::Image.new(
        :quality => quality,
        :width => processed.columns,
        :height => processed.rows,
        :gravity => size["gravity_type"],
        :name => File.basename(file[:filename]).gsub(/#{File.extname(file[:filename])}$/, ""),
        :ext => File.extname(file[:filename]),
        :type => file[:type],
        :content => quality != 0 ? processed.to_blob {self.quality = quality} : processed.to_blob
      )
    end
    result
  end
end

def download_zip(files, sizes)
  return [] if files.nil? || files.empty? || sizes.nil? || sizes.empty?

  files.each do |file|
    file[:results] = Cropify.crop(file, sizes)
  end

  file_name = params["folder"] || "cropify-images.zip"
  t = Tempfile.new("cropify-tempfiles-#{Time.now}-#{rand(10000)}")

  Zip::ZipOutputStream.open(t.path) do |z|
    files.each do |file|
      ext = File.extname(file[:filename])
      basename = File.basename(file[:filename])
      file[:results].each do |cropped|
        z.put_next_entry(cropped.detailed_name)
        z.print cropped.content # IO.read(file[:tempfile].path)
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
  zip = download_zip(params["files"], params["cropfiy"])
end