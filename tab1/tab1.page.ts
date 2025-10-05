import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; // your AuthService
import { jsPDF } from "jspdf";


interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image: string;
  category: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  // --- Search & Filter ---
  searchText: string = '';
  selectedCategory: string = 'All';
  showOnlyFavorites: boolean = false;

  // --- Recipes ---
  recipes: Recipe[] = [];
  selectedRecipe: Recipe | null = null;

  // --- Add/Edit Recipe Modal ---
  showAddSidebar: boolean = false;
  newRecipe: any = {
    name: '',
    description: '',
    ingredients: '',
    steps: '',
    image: '',
    category: 'Breakfast'
  };
  editingRecipeId: number | null = null;

  get editingRecipe(): boolean {
    return this.editingRecipeId !== null;
  }
  

  // --- Login & Signup ---
  showLoginModal: boolean = false;
  showSignupModal: boolean = false;
  currentUser: string | null = null;
  loginData: any = { email: '', password: '' };
  signupData: any = { name: '', email: '', password: '' };

  constructor(private authService: AuthService) {
    // --- Sample recipes ---
    this.recipes = [
      {
        id: 1,
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon and cheese',
        ingredients: ['200g spaghetti', '100g bacon', '2 eggs', '50g parmesan', 'Salt & Pepper'],
        steps: ['Boil pasta', 'Cook bacon', 'Mix eggs and cheese', 'Combine all', 'Serve hot'],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ0zZ1UqDzGmEYfnEH39wv37V3N4OBEItaxg&s',
        category: 'Lunch',
        isFavorite: false
      },
      {
        id: 2,
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake',
        ingredients: ['200g flour', '100g cocoa powder', '150g sugar', '2 eggs', '100ml milk'],
        steps: ['Preheat oven', 'Mix dry ingredients', 'Add wet ingredients', 'Bake 30 mins', 'Cool & serve'],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL6DnII2nXrxhF3EDqyzwSuykaj7iUDa_itQ&s',
        category: 'Dessert',
        isFavorite: false
      },
      { id: 3, name: 'Avocado Toast',
        description: 'Healthy breakfast with avocado and eggs', 
        ingredients: ['2 slices bread', '1 avocado', '1 egg', 'Salt & Pepper'], 
        steps: ['Toast bread', 'Mash avocado', 'Top with egg', 'Serve immediately'], 
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141', 
        category: 'Breakfast', isFavorite: false }, 
        { id: 4, name: 'Caesar Salad', 
          description: 'Crispy lettuce with creamy dressing', 
          ingredients: ['Lettuce', 'Croutons', 'Parmesan', 'Caesar dressing'], 
          steps: ['Chop lettuce', 'Add croutons and cheese', 'Pour dressing', 'Toss and serve'], 
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE3YkM8NmzPDzi7gzI7YWR6FOd4zANs6u0fQ&s', 
          category: 'Lunch', isFavorite: false },
      { id: 5, name: 'Pancakes', description: 'Fluffy pancakes with syrup', ingredients: ['Flour', 'Milk', 'Eggs', 'Baking powder', 'Sugar'], steps: ['Mix ingredients', 'Cook on skillet', 'Serve with syrup'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxdJjWsKaqYH9Ruu_P7-op6-bR69GjhdPo8A&s', category: 'Breakfast', isFavorite: false }, 
      { id: 6, name: 'Paneer Butter Masala', description: 'Rich creamy curry with paneer cubes', ingredients: ['Paneer', 'Butter', 'Tomato puree', 'Cream', 'Spices'], steps: ['Cook onion-tomato masala', 'Add spices', 'Mix with cream', 'Add paneer cubes', 'Simmer & serve'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAo6rlT7gmvUg-qwqw0nouUX9MXpNbq4IKtg&s', category: 'Dinner', isFavorite: false }, 
      { id: 7, name: 'Chole Bhature', description: 'Spicy chickpeas curry with fried bread', ingredients: ['Chickpeas', 'Onion', 'Tomato', 'Flour', 'Spices'], steps: ['Soak & cook chickpeas', 'Prepare curry', 'Make dough', 'Deep fry bhature', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSuSL7nYCN7AHHeZL1xLykJzQPuhZpjjcc0w&s', category: 'Lunch', isFavorite: false }, 
      { id: 8, name: 'Masala Dosa', description: 'Crispy dosa with spiced potato filling', ingredients: ['Rice batter', 'Urad dal', 'Potatoes', 'Onion', 'Spices'], steps: ['Prepare batter', 'Cook dosa on tawa', 'Make potato masala', 'Fill & roll dosa', 'Serve with chutney'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMd48V6zfAxNcebYbWX_SYS8ORDdyHiYZG-A&s', category: 'Breakfast', isFavorite: false }, 
      { id: 9, name: 'Palak Paneer', description: 'Spinach curry with paneer cubes', ingredients: ['Spinach', 'Paneer', 'Onion', 'Tomato', 'Spices'], steps: ['Blanch spinach', 'Make spinach puree', 'Cook with spices', 'Add paneer cubes', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgs1t3C1iWoNcUhVEWv8fs3VOJUhuhfdoYNQ&s', category: 'Dinner', isFavorite: false }, 
      { id: 10, name: 'Vegetable Biryani', description: 'Fragrant rice cooked with vegetables and spices', ingredients: ['Basmati rice', 'Mixed vegetables', 'Onion', 'Tomato', 'Spices'], steps: ['Cook vegetables with spices', 'Layer rice and veggies', 'Cook on dum', 'Serve with raita'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjhEcCdWUknJLusPBqu_m7CH5ZYAlCXWPd-Q&s', category: 'Lunch', isFavorite: false }, 
      { id: 11, name: 'Aloo Gobi', description: 'Potato and cauliflower dry curry', ingredients: ['Potato', 'Cauliflower', 'Onion', 'Tomato', 'Spices'], steps: ['Cook onion-tomato masala', 'Add potatoes & cauliflower', 'Cook until tender', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYMm4H01KGTOOMjn5UrMOuVb4tZ4GnIEKGlw&s', category: 'Dinner', isFavorite: false }, 
      { id: 12, name: 'Rajma Masala', description: 'Red kidney beans curry', ingredients: ['Rajma', 'Onion', 'Tomato', 'Ginger-Garlic', 'Spices'], steps: ['Soak & cook rajma', 'Prepare onion-tomato masala', 'Add rajma and cook', 'Serve with rice'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWg49u9p5QmoT8cyRWxIg_s4uPBl7BHMNqAg&s', category: 'Lunch', isFavorite: false }, 
      { id: 13, name: 'Dhokla', description: 'Soft steamed gram flour cake', ingredients: ['Gram flour', 'Yogurt', 'Baking soda', 'Spices', 'Water'], steps: ['Prepare batter', 'Steam dhokla', 'Tempering with mustard & curry leaves', 'Serve with chutney'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHdcvctolr5ay4p31eVgDeCBRytA156CKMUA&s', category: 'Breakfast', isFavorite: false }, 
      { id: 14, name: 'Baingan Bharta', description: 'Smoky mashed eggplant curry', ingredients: ['Eggplant', 'Onion', 'Tomato', 'Spices', 'Oil'], steps: ['Roast eggplant', 'Cook onion-tomato masala', 'Mix mashed eggplant', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-tG2aKUH_5WcDJGSST32BGJ5ICP7vFhGTJA&s', category: 'Dinner', isFavorite: false }, 
      { id: 15, name: 'Pav Bhaji', description: 'Spiced mixed vegetable mash served with buttered bread', ingredients: ['Mixed vegetables', 'Tomato', 'Onion', 'Spices', 'Pav bread'], steps: ['Cook and mash vegetables with spices', 'Toast pav with butter', 'Serve together'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd7FS1I8nPR18Jewb2-j4E5WxITsVmLWKe8g&s', category: 'Lunch', isFavorite: false }, 
      { id: 16, name: 'Veg Pulao', description: 'Fragrant rice with vegetables', ingredients: ['Basmati rice', 'Mixed vegetables', 'Onion', 'Spices', 'Oil'], steps: ['Cook vegetables', 'Add rice and spices', 'Cook till done', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSL32nvAl6XEOrpzbKywNkhNqgHos_G_rgAg&s', category: 'Lunch', isFavorite: false }, 
      { id: 17, name: 'Paneer Tikka', description: 'Marinated paneer cubes grilled to perfection', ingredients: ['Paneer', 'Yogurt', 'Spices', 'Oil', 'Bell peppers'], steps: ['Marinate paneer', 'Grill or bake', 'Serve with chutney'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp_Gj0BPb50hjvrvpZGPSmZJrykgsVjP3JBA&s', category: 'Dinner', isFavorite: false }, 
      { id: 18, name: 'Vegetable Upma', description: 'Savory semolina breakfast with vegetables', ingredients: ['Semolina', 'Vegetables', 'Onion', 'Spices', 'Water'], steps: ['Roast semolina', 'Cook vegetables with spices', 'Mix semolina and cook', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAy2TwHJbhrLRlOLiC9qmluP9Gwk_H_oLByw&s', category: 'Breakfast', isFavorite: false }, 
      { id: 19, name: 'Stuffed Paratha', description: 'Flatbread stuffed with spiced vegetables', ingredients: ['Wheat flour', 'Potato/Paneer', 'Spices', 'Oil'], steps: ['Prepare dough', 'Stuff with filling', 'Cook on tawa', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyTLPU04Y0dyztCvVzzCp4t4aQKFytu79Tg&s', category: 'Breakfast', isFavorite: false }, 
      { id: 20, name: 'Dal Tadka', description: 'Yellow lentils tempered with spices', ingredients: ['Yellow dal', 'Onion', 'Tomato', 'Spices', 'Ghee'], steps: ['Cook dal', 'Prepare tempering', 'Mix with dal', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJplvD8R_PYPA5lSe82NoPOsIwzgFE5JLfQ&s', category: 'Lunch', isFavorite: false }, 
      { id: 21, name: 'Vegetable Korma', description: 'Mixed vegetables cooked in creamy sauce', ingredients: ['Mixed vegetables', 'Onion', 'Tomato', 'Cream', 'Spices'], steps: ['Cook vegetables', 'Prepare creamy gravy', 'Mix together', 'Serve hot'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmp0npGz1DjXwII8GHfB7zYK0YcC05vs_HpA&s', category: 'Dinner', isFavorite: false }, 
      { id: 22, name: 'Rajma Chawal', description: 'Kidney beans curry served with rice', ingredients: ['Rajma', 'Onion', 'Tomato', 'Spices', 'Rice'], steps: ['Cook rajma', 'Prepare onion-tomato masala', 'Serve with rice'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFI-Y2_8K1npyejAhvPFUOwfXPOmt6TrdrBA&s', category: 'Lunch', isFavorite: false }, 
      { id: 23, name: 'Vegetable Sandwich', description: 'Quick sandwich with fresh vegetables', ingredients: ['Bread', 'Vegetables', 'Cheese', 'Spices', 'Butter'], steps: ['Toast bread', 'Add filling', 'Serve immediately'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv9GhDCe9WTc4hnCvXEpDy7zEwBiWyCSHsTg&s', category: 'Breakfast', isFavorite: false }, 
      { id: 24, name: 'Matar Paneer', description: 'Peas and paneer curry', ingredients: ['Paneer', 'Peas', 'Onion', 'Tomato', 'Spices'], steps: ['Cook onion-tomato masala', 'Add peas and paneer', 'Simmer & serve'], image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8qBBoMn1_zoG5Rjlir0ND823cNy5uXs1OwQ&s', category: 'Dinner', isFavorite: false },
    ];
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  // --- Filter Recipes ---
  filteredRecipes(): Recipe[] {
    return this.recipes.filter(r =>
      (!this.showOnlyFavorites || r.isFavorite) &&
      (this.selectedCategory === 'All' || r.category === this.selectedCategory) &&
      r.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // --- Recipe Modal ---
  openRecipe(recipe: Recipe) { this.selectedRecipe = recipe; }
  closeRecipe() { this.selectedRecipe = null; }
  toggleFavorite(recipe: Recipe) { recipe.isFavorite = !recipe.isFavorite; }

  // --- Download Recipe as PDF ---
downloadRecipe(recipe: Recipe | null) {
  if (!recipe) return;

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text(recipe.name, 10, 20);

  // Category & Description
  doc.setFontSize(12);
  doc.text(`Category: ${recipe.category}`, 10, 30);
  doc.text(`Description: ${recipe.description}`, 10, 40);

  // Ingredients
  doc.text("Ingredients:", 10, 50);
  recipe.ingredients.forEach((ing, i) => {
    doc.text(`- ${ing}`, 10, 60 + i * 10);
  });

  // Steps
  const stepsStartY = 60 + recipe.ingredients.length * 10 + 10;
  doc.text("Steps:", 10, stepsStartY);
  recipe.steps.forEach((step, i) => {
    doc.text(`${i + 1}. ${step}`, 10, stepsStartY + 10 + i * 10);
  });

  // Save PDF
  doc.save(`${recipe.name}.pdf`);
}

  // --- Add/Edit Recipe ---
  openAddSidebar() {
    this.showAddSidebar = true;
    this.editingRecipeId = null;
    this.newRecipe = { name: '', description: '', ingredients: '', steps: '', image: '', category: 'Breakfast' };
  }

  closeAddSidebar() { this.showAddSidebar = false; }

  addOrUpdateRecipe() {
    if (!this.newRecipe.name || !this.newRecipe.description) {
      alert('Please enter both name and description.');
      return;
    }

    const ingredientsArray = this.newRecipe.ingredients ? this.newRecipe.ingredients.split(',').map((i: string) => i.trim()) : [];
    const stepsArray = this.newRecipe.steps ? this.newRecipe.steps.split(',').map((s: string) => s.trim()) : [];

    if (this.editingRecipeId) {
      // --- Update existing recipe ---
      const index = this.recipes.findIndex(r => r.id === this.editingRecipeId);
      if (index !== -1) {
        this.recipes[index] = {
          id: this.editingRecipeId,
          name: this.newRecipe.name,
          description: this.newRecipe.description,
          category: this.newRecipe.category,
          image: this.newRecipe.image || 'assets/default-recipe.jpg',
          ingredients: ingredientsArray,
          steps: stepsArray,
          isFavorite: this.recipes[index].isFavorite
        };
        alert('Recipe updated successfully!');
      }
    } else {
      // --- Add new recipe ---
      const newId = this.recipes.length ? Math.max(...this.recipes.map(r => r.id)) + 1 : 1;
      const recipe: Recipe = {
        id: newId,
        name: this.newRecipe.name,
        description: this.newRecipe.description,
        category: this.newRecipe.category,
        image: this.newRecipe.image || 'assets/default-recipe.jpg',
        ingredients: ingredientsArray,
        steps: stepsArray,
        isFavorite: false
      };
      this.recipes.push(recipe);
      alert('Recipe added successfully!');
    }

    this.closeAddSidebar();
  }

  editRecipe(recipe: Recipe) {
    this.showAddSidebar = true;
    this.editingRecipeId = recipe.id;
    this.newRecipe = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients.join(', '),
      steps: recipe.steps.join(', '),
      image: recipe.image,
      category: recipe.category
    };
  }

  deleteRecipe(recipe: Recipe) {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      this.recipes = this.recipes.filter(r => r.id !== recipe.id);
      this.closeRecipe();
      alert('Recipe deleted successfully!');
    }
  }

  // --- Login & Signup ---
  openLoginModal() { this.showLoginModal = true; }
  closeLoginModal() { this.showLoginModal = false; }
  openSignupModal() { this.showSignupModal = true; }
  closeSignupModal() { this.showSignupModal = false; }

  login() {
    if (!this.loginData.email || !this.loginData.password) { alert('Fill all fields'); return; }
    const success = this.authService.login(this.loginData.email, this.loginData.password);
    if (success) {
      alert(`Welcome back, ${this.authService.getCurrentUser()}!`);
      this.closeLoginModal();
    } else {
      alert('Invalid credentials!');
    }
  }

  signup() {
    if (!this.signupData.name || !this.signupData.email || !this.signupData.password) { alert('Fill all fields'); return; }
    const success = this.authService.signup(this.signupData.name, this.signupData.email, this.signupData.password);
    if (success) {
      alert(`Account created! Welcome, ${this.authService.getCurrentUser()}!`);
      this.closeSignupModal();
    } else {
      alert('Email already exists!');
    }
  }

  logout() {
    this.authService.logout();
    alert('Logged out successfully!');
  }
}
