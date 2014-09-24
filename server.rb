require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader'
require 'sinatra/activerecord'
require 'json'

db = URI.parse('postgres://localhost/stitch_recording')

ActiveRecord::Base.establish_connection(
  :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
  :host     => db.host,
  :database => db.path[1..-1],
  :encoding => 'utf8'
)

class Recording < ActiveRecord::Base
end

set :public_folder, './screenplay'

get '/' do
  redirect 'index.html'
end

get '/recordings' do
  json Recording.all()
end

get '/recordings/:id' do
  json Recording.find(params[:id])
end

put '/recordings/:id' do
  body = JSON.parse(request.body.read.to_s)
  @recording = Recording.find(params[:id])
  @recording.update({
    completed: body['completed'], 
    actor: body['actor'],
    total: body['total'],
  })
  json @recording
end
