## Sept. 6

- **Converted code to TypeScript.** This decision allows our JavaScript to have an agreed-upon schema for interracting with our data. It also allows us to catch errors at compile-time rather than during execution.
- **Created CodePipeline / CloudFormation stack for uploading the React build to a CloudFront distribution.** This choice was made because I've previously set up a website serving assets from CloudFront with CI/CD supplied through CodePipeline and CloudFormation.

## Sept. 7

- **Website is now visible at https://gig-viz.jeremymbell.com**
- **Removed CodePipeline / CloudFormation stack / Cloudfront distribution in favor of AWS Amplify.** I never personally used Amplify prior, but it made the process of setting up a Single-Page App super simple, and comes with CI/CD out of the box.
- **Chose Victory as the Data Viz library.**
  - Of the choices mentioned in the README, I was familiar with D3 and Highcharts; though, used them way back in college.
  - Vega-lite seems the in-house solution at UW for data visualizations, but I wasn't keen on it since it didn't seem mature compared to the other solutions.
  - I particularly was looking for a solution that played well with React. It seemed like only Victory and Highcharts were able to provide React solutions.
  - Highcharts requires a license purchase, so I don't think it's a great choice for a 'production' solution, since we'd have to work with licensing in the future. It is a solution that would be fine in the scope of this project.
  - Victory has a MIT license, which allows us to productionize or delete it at our free will.
  - Drawback of Victory is that it doesn't include a Geographical map visualization. If this becomes important, we can try using [react-simple-maps](https://github.com/zcreativelabs/react-simple-maps)
- **Control selections now trigger a side-effect of loading in data to the `Viz` component.**
