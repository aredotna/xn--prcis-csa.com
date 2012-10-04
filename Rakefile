require 'rubygems'
require 'aws-sdk'

class S3Helper
  class << self
    def config
      YAML.load_file("./config/s3.yml")
    end

    def connection(bucket)
      return AWS::S3.new(
          :access_key_id => S3Helper.config[bucket]['access_key_id'],
          :secret_access_key => S3Helper.config[bucket]['secret_access_key']
        )
    end
  end
end

class Upload
  class << self
    def bucket_path(f)
      f.gsub(/\.\/public\//, '')
    end

    def mime_type(f)
      mimetype = `file --mime-type --brief #{f}`
    end
  end
end

namespace :deploy do
  task :static do
    puts 'Compressing...'
    `brunch build --minify`

    puts 'Deploying...'
    _s3 = S3Helper.connection('present')
    _bucket = _s3.buckets[S3Helper.config['present']['bucket']]

    Dir.glob("./public/**/*.*").each do |f|
      puts "Uploading: #{f}, #{Upload.mime_type(f)}"
      _bucket.objects["#{Upload.bucket_path(f)}"].write(
          open(f), :acl => :public_read
        )
    end

    puts 'Deploy complete.'
  end
end