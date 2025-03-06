# Pentia Mobile Development Task

I've been tasked by Pentia Mobile to make a simple chat application using the Firebase platform and React Native.

## Time estimation

Before making any estimation I need to gather the size of the project. And because I have not worked with Firebase before I should do some research into it.

After 10 minutes of research I feel like I've gotten a decent idea about what Firebase is and how I can use it in this project.

- The setup of a firebase project and authenticating with it inside the app should not take that long, but because it's completely new to me I will estimate it will take 30-45 minutes.

The app should have a minimum of 4 screens; The splash screen, login screen, chat rooms overview screen, chat room screen/"send and receive" screen

- Splash screen: 5.5 hours
    - Should load all relevant data for the app: 1 hour
        - Load Firebase: 30-45 minutes
        - Check user is logged in: 15 minutes
            - Load chat rooms: 15 minutes
    - Fade to next screen: 30 minutes
    - UI: 4 hours
        - Research native look+feel of Android and IOS: 1 hour
        - Implement that UI in React Native: 3 hours
    
- Login Screen: 3 hours
    - Add sign in methods: 2 hours
        - Research how: 1 hour
        - Google: 30 minutes
        - Facebook: 30 minutes
    - Error checking: 30 minutes
    - Redirect to chat rooms overview screen on success: 30 minutes

- Chat rooms overview screen: 4 hours
    - Pull to refresh: 30 minutes
    - UI: 3 hours 
        - Design of list item: 2 hours
        - Design of list view: 1 hour
    - Click redirect to correct chat room/"send and receive" screen: 30 minutes

- Chat room screen / "Send and receive" screen: 6 hours
    - Load messages elegantly: 1 hour
        - Show "skeleton" elements of chat messages when not loaded yet: 45 minutes
        - Load messages: 15 minutes
    - Real time connection: 2 hours
        - Research how to implement this: 1.5 hours
        - Implementation: 30 minutes
    - Scroll listener to the top to load more messages: 30 minutes
    - Open keyboard on input field press: 30 minutes
    - UI: 2 hours
        - Message component: 1 hour
        - Message list: 1 hour
        
- Push notifications: 7 hours
    - Research permissions: 2 hours
    - Design of prompt for notifications: 1 hour
    - Research push notification functionality: 2 hours
    - Click handler for notification: 2 hours

- Image upload: 3 hours
    - Request permissions: 1 hour
        - Camera: 30 minutes
        - Files/photo gallery: 30 minutes
    - Design of message component with image: 2 hours

- Unit testing: 2 hours
    - React native components: 2 hours

- Integration testing: 2 hours

- Documentation: 2 hours

### TLDR:

I estimate this project will take me 34.5 hours from start to finish.

### Justification:

I am a student developer and have not worked with app development before. I may have overestimated some items, like the push notifications, but that is because I have never worked with them before and it's better to overestimate than underestimate in my opinion.

I am also not the most confident with UI design, so in general I give myself more time for that so I can do it well. I am a bit perfectionistic when it comes to UX, so I second-guess myself a lot, costing more time
