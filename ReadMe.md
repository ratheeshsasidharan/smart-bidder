# Project bidding application using Spring webflux and react

### Summary of requirements

### Functional Requirements
Using this application, customers can post projects with requirements including a description of the work, the number of hours expected, and the last day and time for accepting bids.
Tradespeople then bid to work on these projects using either a fixed price or hourly basis. The tradesperson with the lowest bid for the project wins when the deadline is reached.
This is an open-ended fullstack exercise. At minimum your solution should include -
1. A frontend to allow you to demonstrate your app
2. A backend which can, but not limited to:
   a. accept valid project bids from tradespeople
   b. create a job when the deadlines of the projects are reached, which will calculate and
   print the winning bid(s)
3. A data store to persist the application data

### Non Functional Requirements
● To handle 50,000 registered customers.
● On average, 100 projects are posted every day.
● On average, each project receives 50 bids.



Swagger URL - http://localhost:8081/swagger-doc/swagger-ui.html








//TO DO Later

1. Caching of user data for quick fetch from APIs
2. Styling improvements
3. Some validations done in frontend like user based access control to resource to be done in APIs also.


Tom James, user1
Vinod Kumar, user2
Jack Philip, user3
Rob Thomas, user4


Project1

user1
Replace the roofing sheet
I have 3 x damage roof sheet that I need to replace with new one
10hr, 900

user2 - 1000 fixed
Hi, offer includes supply and installation and delivery of new. Removal and disposal of old. Thanks BT 2x metal sheets and 1x polycarbonate sheet as discussed.

user3 - 900 fixed (should win)
Experienced roofer. Please see my reviews. Offer is to remove old roof sheets, supply and fit new roof sheets

user4 - 120 per hr
I’m a builder, interior fit outs specialist and roofing professional available to get the job done properly. We are licensed and insured 



Project2

user4
Concrete backyard
Looking at a quote to get backyard concreted. 5m width and 17m length.
8hr, 2000

user2 - 
Hi  I’m a formwork concreter with all the tools, machinery and equipment to do your job for you. 
2500 fixed

user3 (should win)
We can discuss more details at site
2200 fixed







