/**
 * Curated Undercover Word Pairs Database
 * Each pair contains:
 * - civilian: word given to civilians (or undercover, chosen randomly per round)
 * - undercover: word given to undercover
 * - category: category hint
 * - botCluesCivilian: clues AI bots can give for civilian word
 * - botCluesUndercover: clues AI bots can give for undercover word
 */

const WORD_PAIRS = [
  // Food & Drinks
  {
    civilian: "Pizza",
    undercover: "Burger",
    category: "Food",
    botCluesCivilian: ["Cheese", "Slice", "Crust", "Oven", "Italian", "Delivery", "Toppings"],
    botCluesUndercover: ["Bun", "Patty", "Fries", "Grill", "Sesame", "Fast food", "Pickles"]
  },
  {
    civilian: "Coffee",
    undercover: "Tea",
    category: "Beverage",
    botCluesCivilian: ["Beans", "Espresso", "Morning", "Caffeine", "Roast", "Latte", "Bitter"],
    botCluesUndercover: ["Leaves", "Herbal", "Teapot", "Kettle", "Green", "Steep", "Cup"]
  },
  {
    civilian: "Apple",
    undercover: "Mango",
    category: "Fruit",
    botCluesCivilian: ["Crunchy", "Red", "Pie", "Orchard", "Cider", "Core", "Sweet"],
    botCluesUndercover: ["Tropical", "Yellow", "Juicy", "King of fruits", "Sticky", "Pulp", "Summer"]
  },
  {
    civilian: "Chocolate",
    undercover: "Ice Cream",
    category: "Dessert",
    botCluesCivilian: ["Cocoa", "Bar", "Dark", "Melts", "Sweet", "Fudge", "Candy"],
    botCluesUndercover: ["Cold", "Scoop", "Cone", "Vanilla", "Sundae", "Freezer", "Creamy"]
  },
  {
    civilian: "Pancake",
    undercover: "Waffle",
    category: "Breakfast",
    botCluesCivilian: ["Flat", "Syrup", "Fluffy", "Stack", "Batter", "Griddle", "Sunday"],
    botCluesUndercover: ["Grid", "Crispy", "Iron", "Squares", "Belgian", "Toaster", "Honey"]
  },
  {
    civilian: "Sushi",
    undercover: "Burrito",
    category: "Food",
    botCluesCivilian: ["Roll", "Raw fish", "Seaweed", "Soy sauce", "Wasabi", "Rice", "Japan"],
    botCluesUndercover: ["Tortilla", "Beans", "Wrap", "Salsa", "Foil", "Spicy", "Mexican"]
  },
  {
    civilian: "Coca-Cola",
    undercover: "Pepsi",
    category: "Soda",
    botCluesCivilian: ["Red can", "Classic", "Fizzy", "Secret formula", "Polar bear", "Bubbly"],
    botCluesUndercover: ["Blue can", "Fizzy", "Sweeter", "Generation", "Cola", "Bubbly"]
  },
  {
    civilian: "Cookie",
    undercover: "Brownie",
    category: "Bakery",
    botCluesCivilian: ["Crispy", "Chips", "Jar", "Bake", "Round", "Milk", "Dough"],
    botCluesUndercover: ["Dense", "Fudgy", "Square", "Chocolate", "Rich", "Warm", "Decadent"]
  },
  {
    civilian: "Taco",
    undercover: "Sandwich",
    category: "Quick Bites",
    botCluesCivilian: ["Shell", "Crunchy", "Salsa", "Tuesday", "Filling", "Folded"],
    botCluesUndercover: ["Bread", "Deli", "Sliced", "Lunchbox", "Layers", "Sub"]
  },
  {
    civilian: "Popcorn",
    undercover: "Potato Chips",
    category: "Snacks",
    botCluesCivilian: ["Movie", "Kernel", "Butter", "Microwave", "Fluffy", "Bag"],
    botCluesUndercover: ["Crispy", "Salty", "Spud", "Crunch", "Packet", "Dip"]
  },
  {
    civilian: "Spaghetti",
    undercover: "Ramen",
    category: "Noodles",
    botCluesCivilian: ["Marinara", "Fork", "Meatballs", "Pasta", "Long", "Italian"],
    botCluesUndercover: ["Broth", "Egg", "Slurp", "Bowl", "Chopsticks", "Instant"]
  },
  {
    civilian: "Ketchup",
    undercover: "Mustard",
    category: "Condiment",
    botCluesCivilian: ["Tomato", "Red", "Fries", "Bottle", "Sweet", "Dip"],
    botCluesUndercover: ["Yellow", "Spicy", "Seeds", "Hot dog", "Tangy", "Spread"]
  },

  // Animals
  {
    civilian: "Cat",
    undercover: "Dog",
    category: "Pets",
    botCluesCivilian: ["Meow", "Purr", "Whiskers", "Independent", "Claws", "Yarn", "Litter"],
    botCluesUndercover: ["Bark", "Leash", "Loyal", "Fetch", "Puppy", "Tail wag", "Bone"]
  },
  {
    civilian: "Lion",
    undercover: "Tiger",
    category: "Wild Cats",
    botCluesCivilian: ["Mane", "Pride", "King", "Roar", "Savannah", "Africa"],
    botCluesUndercover: ["Stripes", "Orange", "Jungle", "Solitary", "Predator", "Asia"]
  },
  {
    civilian: "Dolphin",
    undercover: "Whale",
    category: "Sea Creatures",
    botCluesCivilian: ["Click", "Playful", "Ocean", "Jumps", "Mammal", "Smart", "Flipper"],
    botCluesUndercover: ["Giant", "Blowhole", "Huge", "Deep ocean", "Singing", "Baleen"]
  },
  {
    civilian: "Wolf",
    undercover: "Fox",
    category: "Canines",
    botCluesCivilian: ["Howl", "Pack", "Moon", "Wild", "Timber", "Predator"],
    botCluesUndercover: ["Cunning", "Orange", "Tail", "Sneaky", "Sly", "Burrow"]
  },
  {
    civilian: "Duck",
    undercover: "Goose",
    category: "Birds",
    botCluesCivilian: ["Quack", "Pond", "Beak", "Rubber", "Waterfowl", "Webbed feet"],
    botCluesUndercover: ["Honk", "Aggressive", "V-formation", "Feathers", "Migrate", "Long neck"]
  },
  {
    civilian: "Horse",
    undercover: "Donkey",
    category: "Equines",
    botCluesCivilian: ["Saddle", "Gallop", "Mane", "Stallion", "Riding", "Neigh"],
    botCluesUndercover: ["Stubborn", "Ears", "Pack animal", "Bray", "Hee-haw", "Small"]
  },
  {
    civilian: "Rabbit",
    undercover: "Squirrel",
    category: "Small Animals",
    botCluesCivilian: ["Carrot", "Hop", "Long ears", "Burrow", "Fluffy tail", "Fast"],
    botCluesUndercover: ["Acorn", "Bushy tail", "Trees", "Nuts", "Climb", "Winter stash"]
  },
  {
    civilian: "Eagle",
    undercover: "Owl",
    category: "Birds",
    botCluesCivilian: ["Soar", "Sharp eyes", "Talon", "Freedom", "Apex", "Daylight"],
    botCluesUndercover: ["Night", "Wise", "Hoot", "Head rotation", "Silent flight", "Feathers"]
  },
  {
    civilian: "Crocodile",
    undercover: "Alligator",
    category: "Reptiles",
    botCluesCivilian: ["Saltwater", "V-snout", "Ancient", "Teeth", "Swamp", "Green"],
    botCluesUndercover: ["Freshwater", "U-snout", "Florida", "Bite", "Swamp", "Dark"]
  },

  // Everyday Objects & Technology
  {
    civilian: "Bed",
    undercover: "Sofa",
    category: "Furniture",
    botCluesCivilian: ["Sleep", "Mattress", "Pillow", "Night", "Sheets", "Dream"],
    botCluesUndercover: ["Living room", "Cushion", "TV", "Sit", "Comfy", "Nap"]
  },
  {
    civilian: "Pen",
    undercover: "Pencil",
    category: "Stationery",
    botCluesCivilian: ["Ink", "Click", "Permanent", "Ballpoint", "Sign", "Blue"],
    botCluesUndercover: ["Lead", "Graphite", "Eraser", "Sharpen", "Sketch", "Wood"]
  },
  {
    civilian: "Cup",
    undercover: "Bowl",
    category: "Kitchen",
    botCluesCivilian: ["Drink", "Handle", "Tea", "Ceramic", "Liquid", "Sip"],
    botCluesUndercover: ["Soup", "Cereal", "Deep", "Spoon", "Round", "Eat"]
  },
  {
    civilian: "Watch",
    undercover: "Clock",
    category: "Timepieces",
    botCluesCivilian: ["Wrist", "Strap", "Tick", "Portable", "Smart", "Time"],
    botCluesUndercover: ["Wall", "Tick-tock", "Alarm", "Big", "Living room", "Numbers"]
  },
  {
    civilian: "Laptop",
    undercover: "Tablet",
    category: "Gadgets",
    botCluesCivilian: ["Keyboard", "Trackpad", "Foldable", "Work", "Screen", "Charger"],
    botCluesUndercover: ["Touchscreen", "Stylus", "Drawing", "Portable", "Flat", "Apps"]
  },
  {
    civilian: "Headphones",
    undercover: "Earbuds",
    category: "Audio",
    botCluesCivilian: ["Over-ear", "Band", "Music", "Cushion", "Studio", "Sound"],
    botCluesUndercover: ["In-ear", "Case", "Wireless", "Tiny", "Pocket", "Bluetooth"]
  },
  {
    civilian: "Candle",
    undercover: "Flashlight",
    category: "Light Sources",
    botCluesCivilian: ["Wax", "Flame", "Wick", "Scent", "Melt", "Romantic"],
    botCluesUndercover: ["Battery", "Beam", "Torch", "Switch", "Emergency", "LED"]
  },
  {
    civilian: "Umbrella",
    undercover: "Raincoat",
    category: "Rain Gear",
    botCluesCivilian: ["Canopy", "Open", "Puddle", "Handle", "Storm", "Dry"],
    botCluesUndercover: ["Wearable", "Hood", "Waterproof", "Sleeves", "Yellow", "Zip"]
  },
  {
    civilian: "Mirror",
    undercover: "Window",
    category: "Glass",
    botCluesCivilian: ["Reflection", "Bathroom", "Look at self", "Silver", "Vanity"],
    botCluesUndercover: ["Transparent", "Curtain", "View", "Outside", "Sunlight", "Sill"]
  },

  // Places & Nature
  {
    civilian: "Beach",
    undercover: "Swimming Pool",
    category: "Water Places",
    botCluesCivilian: ["Sand", "Waves", "Ocean", "Sunscreen", "Seashells", "Coast"],
    botCluesUndercover: ["Chlorine", "Tiles", "Lanes", "Ladder", "Backyard", "Deep end"]
  },
  {
    civilian: "Mountain",
    undercover: "Hill",
    category: "Geography",
    botCluesCivilian: ["Peak", "Snow", "Summit", "High altitude", "Steep", "Climb"],
    botCluesUndercover: ["Gentle slope", "Green", "Rolling", "Grassy", "Small", "Hike"]
  },
  {
    civilian: "Hotel",
    undercover: "Hostel",
    category: "Lodging",
    botCluesCivilian: ["Keycard", "Room service", "Luxury", "Bellhop", "Private", "Suite"],
    botCluesUndercover: ["Bunk bed", "Shared room", "Backpacker", "Budget", "Social", "Locker"]
  },
  {
    civilian: "Library",
    undercover: "Bookstore",
    category: "Reading Places",
    botCluesCivilian: ["Quiet", "Borrow", "Cards", "Silence", "Librarian", "Shelves"],
    botCluesUndercover: ["Buy", "Cashier", "New releases", "Coffee shop", "Prices", "Display"]
  },
  {
    civilian: "Cinema",
    undercover: "Theater",
    category: "Entertainment",
    botCluesCivilian: ["Projector", "Screen", "Popcorn", "Seats", "Dark", "Hollywood"],
    botCluesUndercover: ["Stage", "Live actors", "Curtain", "Applause", "Drama", "Play"]
  },
  {
    civilian: "Forest",
    undercover: "Jungle",
    category: "Wilderness",
    botCluesCivilian: ["Pine trees", "Woodland", "Campfire", "Trails", "Leaves", "Temperate"],
    botCluesUndercover: ["Dense", "Vines", "Tropical", "Rain", "Humid", "Wild animals"]
  },

  // Pop Culture & Games
  {
    civilian: "Batman",
    undercover: "Superman",
    category: "Superheroes",
    botCluesCivilian: ["Gotham", "Cape", "Dark", "Batmobile", "Billionaire", "Cave"],
    botCluesUndercover: ["Krypton", "Fly", "Red cape", "Alien", "Laser eyes", "Metropolis"]
  },
  {
    civilian: "Guitar",
    undercover: "Violin",
    category: "Instruments",
    botCluesCivilian: ["Six strings", "Strum", "Fret", "Rock", "Acoustic", "Pick"],
    botCluesUndercover: ["Bow", "Four strings", "Orchestra", "Chin", "Classical", "Wood"]
  },
  {
    civilian: "Soccer",
    undercover: "Basketball",
    category: "Sports",
    botCluesCivilian: ["Goal", "Kick", "Pitch", "Cleats", "90 minutes", "World Cup"],
    botCluesUndercover: ["Hoop", "Dribble", "Court", "Dunk", "Net", "Sneakers"]
  },
  {
    civilian: "Instagram",
    undercover: "TikTok",
    category: "Social Media",
    botCluesCivilian: ["Photos", "Stories", "Feed", "Filters", "Grid", "Reels"],
    botCluesUndercover: ["Short videos", "FYP", "Trends", "Viral", "Scroll", "Sound"]
  },
  {
    civilian: "Chess",
    undercover: "Checkers",
    category: "Board Games",
    botCluesCivilian: ["King", "Queen", "Knight", "Checkmate", "Squares", "Strategy"],
    botCluesUndercover: ["Discs", "Jump", "Kinged", "Black and red", "Diagonal", "Simple"]
  },
  {
    civilian: "Sun",
    undercover: "Moon",
    category: "Celestial",
    botCluesCivilian: ["Bright", "Heat", "Day", "Solar", "Golden", "Star"],
    botCluesUndercover: ["Night", "Craters", "Tides", "Phases", "Silver", "Orbit"]
  }
];

// Fallback generic clues for Mr. White bots trying to blend in!
const MR_WHITE_BLUFF_CLUES = [
  "Essential",
  "Classic",
  "Very common",
  "Popular",
  "Everyday",
  "Important",
  "Appealing",
  "Familiar",
  "Interesting",
  "Special",
  "Vibrant",
  "Traditional"
];

/**
 * Returns a randomized word pair with roles assigned
 */
function getRandomWordPair(usedPairs = []) {
  const available = WORD_PAIRS.filter(
    p => !usedPairs.includes(`${p.civilian}_${p.undercover}`)
  );
  const pool = available.length > 0 ? available : WORD_PAIRS;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  // 50% chance to swap civilian and undercover words for freshness
  const swap = Math.random() > 0.5;
  const civilianWord = swap ? selected.undercover : selected.civilian;
  const undercoverWord = swap ? selected.civilian : selected.undercover;
  const civilianBotClues = swap ? selected.botCluesUndercover : selected.botCluesCivilian;
  const undercoverBotClues = swap ? selected.botCluesCivilian : selected.botCluesUndercover;

  return {
    pairKey: `${selected.civilian}_${selected.undercover}`,
    category: selected.category,
    civilianWord,
    undercoverWord,
    civilianBotClues,
    undercoverBotClues
  };
}

module.exports = {
  WORD_PAIRS,
  MR_WHITE_BLUFF_CLUES,
  getRandomWordPair
};
