# Test Checklist

## ✅ Smoke Tests
- [ ] [@smoke @regression] should show error for incorrect username  
- [ ] [@smoke @regression] should show error for incorrect password  
- [ ] [@smoke @regression] should log in - standard user  
- [ ] [@smoke @regression] should add 2 items and complete checkout successfully  
- [ ] [@smoke @regression] should add and remove items from cart  

---

## 🔄 Regression Tests
### Authentication
- [ ] [@smoke @regression] should show error for incorrect username  
- [ ] [@smoke @regression] should show error for incorrect password  
- [ ] [@smoke @regression] should log in - standard user  
- [ ] [@regression] should log in – locked out user  
- [ ] [@regression] should log in - glitch user  

### Navigation & Menu
- [ ] [@regression] should navigate to Saucelabs in the same tab when clicking 'About'  
- [ ] [@regression] should navigate to login page after clicking 'Logout'  
- [ ] [@regression] should close burger menu  

### Cart & Checkout
- [ ] [@regression] should reset cart, filters and buttons  
- [ ] [@regression] should show “Basket is empty” popup when trying to proceed with empty cart  
- [ ] [@regression] should support navigation between checkout steps using goBack and goForward  
- [ ] [@regression] should support reload in checkout  
- [ ] [@smoke @regression] should add 2 items and complete checkout successfully  
- [ ] [@regression] should remove one item after continuing shopping, then complete checkout  
- [ ] [@regression] should cancel on the overview page, return to inventory, and preserve items  
- [ ] [@regression] should display an error message in the checkout personal information form  
- [ ] [@regression] should add 2 items, start checkout, cancel, return to cart, verify item count, then complete checkout  
- [ ] [@regression] should add 2 items, delete 1 from cart, verify count, and complete checkout  
- [ ] [@regression] should add 2 items from product details pages, and complete checkout successfully  
- [ ] [@regression] should add all products, complete checkout, and verify app is reset  
- [ ] [@regression] Should navigate back to products page after order completion  
- [ ] [@regression] Should navigate to product detail page when clicking product link in checkout  
- [ ] [@regression] Should navigate to product detail page when clicking product link in cart  
- [ ] [@regression] should remove item from cart on the details page  
- [ ] [@regression] should increment cart count when adding items and complete checkout  

### Cart & Items
- [ ] [@smoke @regression] should add and remove items from cart  

### Filters & Sorting
- [ ] [@regression] should sort A --> Z  
- [ ] [@regression] should sort Z --> A  
- [ ] [@regression] should sort price low --> high  
- [ ] [@regression] should sort price high --> low  

### Product Page
- [ ] [@regression] should load images correctly on the product page  
- [ ] [@regression] should not contain suspicious patterns in product names or descriptions  
- [ ] [@regression] should align product names correctly  
- [ ] [@regression] should not apply forbidden classes to Add to Cart buttons  
- [ ] [@regression] should compare product prices for different users  
