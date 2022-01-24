FROM ruby:2.5.5

RUN bundle config --global frozen 1

WORKDIR /usr/src/app
COPY Gemfile Gemfile.lock ./
RUN bundle install


CMD ["ruby","./app.rb"," -e", "production", "-p", "80"]
