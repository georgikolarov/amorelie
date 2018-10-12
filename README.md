# Template: Responsive PDS Specials

## Instructions
### Is it light or dark skin?
* open _settings.scss
* ```@import "themes/light";``` for light skin
* ```@import "themes/dark";``` for dark skin
  
### Is it a compact or emotional layout?
* open desktop.html
* look at ```<section class="frkit-feature">```
* compact: ```<section class="frkit-feature arrows left|right">```
* emotional: ```<section class="frkit-feature arrows">```
  
 ### Add text
 * copy as many compact|emotional feature container as needed and fill in the text
 * reference the images and fill in alt tags (same text as h2)
   
 ### Add video
 * replace Cliplister Video Id in javascript
 
 ### Add table
 * fill in table information and images
 * adjust breakpoints if needed

 ### Mobile view
 * copy all code between comment tags ```<!--MAIN-CONTENT-START--> <!--MAIN-CONTENT-END-->```
 * open mobile.html
 * paste code between comment tags ```<!--MAIN-CONTENT-START--> <!--MAIN-CONTENT-END-->```
 * adjust image paths
 
 ### Screenshot results
 * Open local view in browser
 * use a screenshot utility like "Awesome Screenshot for Chrome" to capture browser page
   
  ### All done.