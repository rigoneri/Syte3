# Syte3

Syte3 is a personal website that displays data from your social networks.
It's the active running version of my personal website [https://rigoneri.com](https://rigoneri.com).

[Syte](https://github.com/rigoneri/syte) was a side project I built in 2012 that allowed anyone to build a personal website
using some of the latest technologies at the time (jQuery, HTML5, CCS3, Heroku and etc). It quickly gained some traction but I
couldn't find time to maintain it. Then in 2016 I released a complete rewrite of it called [Syte2](https://github.com/rigoneri/Syte2)
using newer technologies (AngularJS, Express, MongoDB, Heroku and etc) but I still couldn't find time to maintain it.

Now it's 2020, between lock-downs and stay at home orders I found time to do another rewrite. I kept a similar design to Syte2 and
it uses some of the latest technologies today: (Get ready for a bunch of AWS nomenclature...)

-   The front-end was built with React using ES6, Functional Components, Hooks, CSS Variables and etc;
-   The api was built with Node.js and Express (JavaScript is not typically my go-to language for the back-end but at least I kept it consistent throughout the project);
-   For hosting I decided to use Amazon Web Services (AWS) since it's the one I'm most familiar with and has an extensive list of services;
-   By using AWS I decided to brake out each interaction with a social network into separate cloud functions using AWS Lambda;
-   Each Lambda function is invoked on an interval that fetches for new data and saves into DynamoDB;
-   The api & front-end is hosted on Amazon's Elastic Container Service (ECS) where it uses a Docker image created during deployment and hosts it on ECS FARGATE's virtual hosts;
-   I then used Amazon's Elastic Load Balancer (ELB) to potentially scale the number of containers and load balance between them (it probably won't need to);
-   I then decided to use CloudFront (Content Delivery Network) to act as a reverse proxy to ELB & ECS by using the HTTP response cache headers to cache responses in the CDN. This prevents the need to scale the number of containers;
-   And because it's 2020 I end up using AWS Certificate Manager to create a free SSL certificate and make my website run on HTTPS 😁
-   The whole deployment is controlled via Github Actions. Every time I push or merge to master it automatically deploys the services to Lambda and does a rolling deployment to ECS (no downtime!);
-   UPDATE: 01/01/2021 - Ported the react app to TypeScript to see if that's something I wanted to use on a different project. I like it, I found a few edge case bugs where otherwise I wouldn't have known.

I may still not find time to maintain this project, and I'll probably not get to write some documentation on how you can get yours running. But
at least it's out here, where you can see the code and maybe learn something from it. If you would like to contribute please do so.

Cheers,

Rigo

PS. It's been kind of fun to watch how web development technologies evolve over time, that's why I still keep the other repos around in an archived/read-only mode.
