## Project Structure


   	├── Intelligent-Security-Compliance-Monitoring
      ├── config
      │   ├── constant.js       	   # Contains all constant used across application. 
      │   └── logger.js         	   # Contains winston logger configuration. Provides 	
      |					     getLogger() function, which takes in a string  	  		
      |	    			  	     parameter and will be used as label in log file.
      ├── controllers
      │   └── controller.js     	   # Contains function which are invoked on API requests. 
      |
      ├── log
      │   └── log.json			   # Application logs will be appended to this file.
      |
      ├── model
      |
      ├── routes
      |	  └── routes.js		   # Maps URL to functions in controller.
      |
      ├── utility
      │   ├── awsService.js     	   # Contains utility functions to get resource information from AWS. 
      |
      ├── package.json        	   # Contains all metadata information about Node JS
      |
      ├── server.js			   # Entrypoint for node js server. Starts server on port 3001.
      |
      └── README.md			   # Documentation file   
