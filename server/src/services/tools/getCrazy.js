export async function getCrazy(parameters = {}) {
  try {
    const { category } = parameters;
    
    const crazyFacts = [
      {
        id: "1",
        category: "fun",
        title: "Random Developer Facts",
        content: "Did you know that the first computer bug was an actual bug? In 1947, Grace Hopper found a moth causing problems in the Harvard Mark II computer!",
        type: "fun_fact"
      },
      {
        id: "2",
        category: "creative",
        title: "Creative Coding Ideas",
        content: "How about building a website that changes color based on the weather, or a portfolio that responds to your mouse movements like a living organism?",
        type: "creative_idea"
      },
      {
        id: "3",
        category: "quirky",
        title: "Quirky Tech Habits",
        content: "Some developers talk to their code, others have lucky coding socks, and some believe in the power of rubber duck debugging!",
        type: "quirky_fact"
      },
      {
        id: "4",
        category: "inspiration",
        title: "Inspirational Coding Quotes",
        content: "The best error message is the one that never shows up. - Thomas Fuchs",
        type: "quote"
      }
    ];
    
    let filteredFacts = crazyFacts;
    
    if (category) {
      filteredFacts = crazyFacts.filter(fact =>
        fact.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return {
      success: true,
      data: filteredFacts,
      type: 'crazy',
      count: filteredFacts.length,
      message: `Retrieved ${filteredFacts.length} fun fact(s) successfully`
    };
  } catch (error) {
    console.error('Error in getCrazy tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve fun information',
      type: 'error'
    };
  }
}
