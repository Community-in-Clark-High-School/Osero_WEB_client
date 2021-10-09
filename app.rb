require 'sinatra'
require 'sinatra/reloader'
require "faraday"

set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
  erb :index
end

get '/api' do
  if params.key?('CLIENT')
    params["CLIENT"]=ENV['Osero_WEB_Client_User']
  end
  if params.key?('PASS')
    params["PASS"]=ENV['Osero_WEB_Client_PASS']
  end
  res = Faraday.get "http://clark.nazocollection.com/if/othello_api.php", params
  res.body()

end

