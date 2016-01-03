# tinycms
First stab at an embeddabble cms

###USE CASE
1. Cross model data user notes.
    1. Inline user help text *anywhere*.
    1. Some social thing.
2. Descriptions of things.
    1. So like, in a store, maybe you could have any CEO able to just change prod descriptions of stuff always. 
3. Summary page "notepad" 

###Example Usage
    <div data-tinycms-id="your-notes"></div>
    
That's it. `tinycms` takes care of the rest (`document.querySelectorAll("[data-tinycms-id]")`) see index.html for example usage. 

###Running Example
Don't have one. You will have to run the app to use it, it has an ajax backend contract:

    GET  view/THINGS              -> HTML
    POST edit/THINGS {data: HTML} -> ''

###Getting Started
I imagine reusing the js for the most part, editing it to include CSRF for post requests. 
But for the most part, it's supposed to be simple so you can copy what you need. 

###Caveats

1. No User access rights. 
2. No html sanitizing. Anything goes.
3. No Listing. No way to get all pages or whatever.
4. css? not sure why the marker span for example needs it's own?

