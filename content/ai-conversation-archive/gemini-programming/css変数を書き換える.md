---
tags:
    - gemini
    - css
    - javascript
---

> [!quote]+ Prompt
> cssの変数
> ```css
> :root {
>     --variable-name: 100px; /* こんなやつ */
> }
> ```
> これをjavaScriptから書き換えることは可能？可能だったらすごいけど...

You want to know if you can change a CSS variable from JavaScript. Yes, that's absolutely possible! In fact, it's a powerful and common technique in modern web development.

---

### Changing CSS Variables with JavaScript

You can change CSS variables from JavaScript by using the `style` property of a DOM element. The process involves two main steps:

1. **Get a reference to the element** that holds the CSS variable. In your case, that's the `:root` pseudo-class. You can access it through the `document.documentElement` property, which represents the `<html>` element.
    
2. **Use the `setProperty()` method** to change the variable's value.
    

Here's how you do it:

JavaScript

```
// Get a reference to the root element (<html>)
const root = document.documentElement;

// Get the current value of the variable
const currentVariable = getComputedStyle(root).getPropertyValue('--variable-name');
console.log(`Current value: ${currentVariable}`); // "100px"

// Change the value of the CSS variable
root.style.setProperty('--variable-name', '200px');

// Verify the new value
const newVariable = getComputedStyle(root).getPropertyValue('--variable-name');
console.log(`New value: ${newVariable}`); // "200px"
```

In this code:

- `document.documentElement` gives you access to the `<style>` property of the `:root` element.
    
- `setProperty('--variable-name', '200px')` is the key method. It takes the variable name (including the two hyphens) and the new value as arguments.
    

This is a great way to create dynamic themes, adjust layouts based on user interaction, or implement dark mode. It's a lot cleaner than writing a bunch of conditional CSS classes.

---

### Reading the Value of a CSS Variable

You can also read the current value of a CSS variable from JavaScript using the `getComputedStyle()` method. This is useful when you need to perform calculations based on the variable's value.

JavaScript

```
// Get the root element
const root = document.documentElement;

// Get the computed style of the root element
const rootStyles = getComputedStyle(root);

// Read the value of the variable
const variableValue = rootStyles.getPropertyValue('--variable-name');

// The value will have leading/trailing whitespace, so it's a good practice to trim it
const cleanValue = variableValue.trim();
console.log(`The value is: ${cleanValue}`); // "100px"
```

Changing CSS variables from JavaScript is a powerful way to bridge the gap between dynamic behavior and styling. It allows you to create more responsive and interactive web applications without relying on complex class toggles or inline styles.