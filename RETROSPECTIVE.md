This page is just meant to lay out my ([JeremyMBell's](https://github.com/JeremyMBell)) overall view on the project and how it went.

# Takeaways

Listed in no particular order.

## Typescript migration saved me time.

In short-term projects, it's hard to determine what developer experience upgrades are worth investing in. We could've gone further with developer experience upgrades:

- Adding linting - this would help enforce a consistent code style. It would be nice in a multi-collaborator and longterm project environment, but with short deadlines, linting doesn't make sense. HOWEVER, it is always better to implement linting earlier to prevent large refactor pull requests.
- Adding utility functions - for instance, the flag API I used is all hosted in the `FlagLabel` component, when the flag API could be its own file. This is relatively low-cost, but also not much high reward. In short-term projects, there is a lot of setup and teardown of code, which doesn't always make sense.

## Creating the data-facade was a good choice.

Originally, I had the data calculations taking place in the Viz itself. Because, I written it in a common area, I was able to rip out the logic very simply compared to other places.

I was also able to mess around with the `DataFilters` easily. In an earlier commit, I have two bar chart viz's, one showing maximum and another showing minimums. The minimum viz took almost no setup time due to how the code was written. I only needed to duplicate the `Viz` (now `BarChartViz`) component and change the props to fit.

## Timed events are hard in a stateful system

I don't often work with timed events, and I think I could've implemented it a little better. There's a lot of consideration for the state of a component in order to do timed events. I probably should've taken some time to find libraries that could decouple the timed events from the React component. However, I was able to find a solution that works for the purposes of this project.

I think the addition of a playback feature was one of the things that made this project. Being able to see the USA rise over the years does add to your understanding of the data, and inspired me to create the candlestick chart.

## More time than necessary was spent on architecture

There really wasn't a need for me to upload my project to a subdomain of my site. And I spent a good few hours trying to make CloudFront work, which ultimately left me to using AWS Amplify. Given another shot at this, I'd probably just scrap my github.io page to temporarily host the project.

## Unsure if Victory was a correct choice

Victory had the pro of having a lot of common code in place for me. It also uses an SVG which allows us to have JavaScript events tied to specific SVG elements. However, I felt like I was wrestling with the library and hitting a ton of sharp edges. I constantly had documentation open.

Tooltips took awhile to spin up, and I'm not fully satisfied with how the tooltips came out. They base their tooltips based on an array of strings, and I can't modify much from it.

It seems like Victory just had a highly opinionated system that I couldn't fully grapple with. Alternatively, I could've not using a React library and just use React for the controls.

## Heatmap would've been great

Touched upon this in the [CHANGELOG](./CHANGELOG.md). I think the heatmap would solve a flaw with my project. We could only see the results for 10 countries (or more if you up the number). But a heatmap wouldn't apply the level of filter. It would also be able to show how different countries change during the opioid crisis. I know that South Africa hit a minimum in 2014, but I would've liked to know more about the data in the following years.

## I like the addition of flags

I think one thing that was terrible when I first booted up Victory was the label overlap. Even rotating to make it legible made the visualization look busy and unusable. The flags were the perfect shorthand to make the graph axes look less bloated. It also tied together iconography that a user could identify with. For instance, I can connect with the US flag and see it move around the charts as I played back the years.
