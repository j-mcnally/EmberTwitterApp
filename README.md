run nginx locally

set a host entry up for your local machine

and have a config like this


	upstream twitter_api {
	  server api.twitter.com:443;
	  #server localhost:3000;
	}
	
	server {
	  listen 127.0.0.1:443;
	        ssl_certificate      /opt/nginx/ssl/server.crt;
	        ssl_certificate_key  /opt/nginx/ssl/server.key;
	
	        ### Add SSL specific settings here ###
	
	
	        ssl_protocols        SSLv3 TLSv1;
	        ssl_ciphers RC4:HIGH:!aNULL:!MD5;
	        ssl_prefer_server_ciphers on;
	        keepalive_timeout    60;
	        ssl_session_cache    shared:SSL:10m;
	        ssl_session_timeout  10m;
	        ssl on;
	
	  server_name embertweets.com;
	  location / {
	    proxy_set_header X-Real-IP $remote_addr;
	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	    proxy_set_header Host $http_host;
	    proxy_set_header X-NginX-Proxy true;
	    proxy_pass http://127.0.0.1:4567/;
	    proxy_redirect off;
	  }
	
	  location /twitter {
	    rewrite      /twitter/(.*)  /$1  break;
	    #proxy_set_header X-Real-IP $remote_addr;
	    #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	    proxy_set_header Host api.twitter.com;
	    proxy_set_header User-Agent 'curl/7.21.4 (x86_64-apple-darwin12.2.0) libcurl/7.21.4 OpenSSL/0.9.8r zlib/1.2.5 libidn/1.20';
	    proxy_set_header Accept $http_accept;
	    proxy_set_header Authorization $http_authorization;
	    proxy_pass_request_headers off;
	    proxy_pass https://twitter_api;
	    proxy_ssl_session_reuse off;
	    proxy_redirect off;
	  }
	}
