## Project Motivation  

   Many industries like Finance, Health-Care refrain from choosing cloud because of lack of security and more susceptibility to data exposure and leaks as cloud environments have expanded perimeters. In Cloud IT infrastructure it is easier for traffic to bypass perimeter defences as resources are highly connected. Due to this multi-faceted, openness, architecture and multi-tenancy,
conventional security is not enough. Center of Internet Security (CIS), a non-profit organization has done great research and has come up with standard cloud security compliances to be followed for securing the cloud resources.

   We are planning to cover CIS benchmarks for AWS, research for more potholes in the AWS services and provide the user with comprehensive suggestions for securing their cloud resources. We plan to achieve this by implementing automated review systems to generate reports for the failed compliances, delineating to a layman the reason and the suggestion to meet compliances and improve security. Example: In AWS Simple Storage Service, the files stored in the bucket should not have read permissions as public.  


## System Design

* [Link to System Design](https://github.com/heyitsvajid/Intelligent-Security-Compliance-Monitoring/blob/master/diagrams/System%20Design.jpg)
<img src="https://github.com/heyitsvajid/Intelligent-Security-Compliance-Monitoring/blob/master/diagrams/System%20Design.jpg" />

## Backend Project Structure


   	├── Intelligent-Security-Compliance-Monitoring
         ├── frontend
         ├── backend
            ├── config
            │   ├── constant.js       	   # Contains all constant used across application. 
            │   └── logger.js         	   # Contains winston logger configuration. Provides 	
            |					                  getLogger() function, which takes in a string  	  		
            |	    			  	               parameter and will be used as label in log file.
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

## To successcully run this project add a .env file under backend folder with below contents:
   AWSAccessKeyId=<YOUR_ACCESS_KEY>
   AWSSecretKey=<YOUR_SECRET_KEY>


## Steps to add API
1. Define route in routes/routes.js  
   - Provide URL name, type and function name to be implemented in controllers/controller.js.  
2. Implement function defined in step 1 in controller/controller.js. This controller will receive API request -> Call Helper function and generate response.  
3. Implement all AWS related helper function in utility/awsService.js

## Backend Logging Standards
1. Import config/logger.js in file.  
2. Call getLogger(string label) function of logger.js
3. Use below methods on logger object:  
   - log.info(string)  
   - log.debug(string)  
   - log.error(string)  
PS: Use JSON.stringify(object) to log an object along with string message.

## Backend Response Object
1. Set HTTP Status Code
2. res.json
   ```
   {
   success: boolean
   errorMessage: string
   successMessage: string
   data: JSON
   }
   ```

## 📝 Author
##### Vajid Kagdi <kbd> [Github](https://github.com/heyitsvajid) / [LinkedIn](https://www.linkedin.com/in/heyitsvajid) / [E-Mail](mailto:vajid9@gmail.com)</kbd>
##### Madhukar BS 
##### Sai Kumar 
##### Akshat Shah
