import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Star, Plus } from "lucide-react";
import axios from "axios";

const CreateRecipesModal = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipeData, setRecipeData] = useState({
    recipeName: "",
    meals: "",
    difficultyEstimation: 1,
    timeEstimation: "",
    nation: "",
    ingredients: [
      { ingredient: "", amount: "", measureUnit: "" },
      { ingredient: "", amount: "", measureUnit: "" },
      { ingredient: "", amount: "", measureUnit: "" }
    ],
    videoLink: "",
    steps: [
      { stepNumber: 1, instruction: "" },
      { stepNumber: 2, instruction: "" },
      { stepNumber: 3, instruction: "" }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setRecipeData({ ...recipeData, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating) => {
    setRecipeData({ ...recipeData, difficultyEstimation: rating });
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((rating) => (
      <button
        key={rating}
        type="button"
        onClick={() => handleStarClick(rating)}
        className="focus:outline-none"
      >
        <Star
          size={24}
          className={`${
            rating <= recipeData.difficultyEstimation
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          } cursor-pointer transition-colors`}
        />
      </button>
    ));
  };

  const validateFirstStep = () => {
    if (!recipeData.recipeName || !recipeData.meals || !recipeData.timeEstimation || !recipeData.nation) {
      setError("Please fill in all required fields");
      return false;
    }
    setError(null);
    return true;
  };

  // Fetch ingredients from API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('/api/ingredients');
        setIngredientsList(response.data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    if (currentStep === 2) {
      fetchIngredients();
    }
  }, [currentStep]);

  // Handle ingredient change
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index][field] = value;
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  // Add new ingredient line
  const addIngredientLine = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [...recipeData.ingredients, { ingredient: "", amount: "", measureUnit: "" }]
    });
  };

  // Validate second step
  const validateSecondStep = () => {
    const hasEmptyFields = recipeData.ingredients.some(
      ing => !ing.ingredient || !ing.amount || !ing.measureUnit
    );
    if (hasEmptyFields) {
      setError("Please fill in all ingredient fields");
      return false;
    }
    setError(null);
    return true;
  };

  // Add new step
  const addStep = () => {
    const newStepNumber = recipeData.steps.length + 1;
    setRecipeData({
      ...recipeData,
      steps: [...recipeData.steps, { stepNumber: newStepNumber, instruction: "" }]
    });
  };

  // Handle step instruction change
  const handleStepChange = (index, value) => {
    const newSteps = [...recipeData.steps];
    newSteps[index].instruction = value;
    setRecipeData({ ...recipeData, steps: newSteps });
  };

  // Validate third step
  const validateThirdStep = () => {
    if (!recipeData.videoLink) {
      setError("Please provide a video link");
      return false;
    }
    const hasEmptySteps = recipeData.steps.some(step => !step.instruction);
    if (hasEmptySteps) {
      setError("Please fill in all step instructions");
      return false;
    }
    setError(null);
    return true;
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const handleNext = () => {
    if (currentStep === 1 && validateFirstStep()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && validateSecondStep()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && validateThirdStep()) {
      // Handle form submission here
      console.log("Form submitted:", recipeData);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 rounded-xl p-6 w-[500px] shadow-2xl border border-gray-700"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Create Recipe</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 1 ? "bg-blue-600" : "bg-gray-600"
              }`}>
                1
              </div>
              <div className="ml-2 text-sm text-gray-300">Recipe Information</div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 2 ? "bg-blue-600" : "bg-gray-600"
              }`}>
                2
              </div>
              <div className="ml-2 text-sm text-gray-300">Ingredients</div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 3 ? "bg-blue-600" : "bg-gray-600"
              }`}>
                3
              </div>
              <div className="ml-2 text-sm text-gray-300">Instructions</div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200">
              {error}
            </div>
          )}

          {/* Step 1: Recipe Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Recipe Name *</label>
                <input
                  type="text"
                  name="recipeName"
                  value={recipeData.recipeName}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Meals *</label>
                <select
                  name="meals"
                  value={recipeData.meals}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a meal type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Difficulty Estimation *</label>
                <div className="flex gap-1">
                  {renderStars()}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Time Estimation *</label>
                <select
                  name="timeEstimation"
                  value={recipeData.timeEstimation}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select preparation time</option>
                  <option value="15 mins">15 minutes</option>
                  <option value="30 mins">30 minutes</option>
                  <option value="45 mins">45 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2+ hours">2+ hours</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Nation/Region *</label>
                <select
                  name="nation"
                  value={recipeData.nation}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a region</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Japan">Japan</option>
                  <option value="Korea">Korea</option>
                  <option value="China">China</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Italy">Italy</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                </select>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Next Step
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Ingredients */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {recipeData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={ingredient.ingredient}
                    onChange={(e) => handleIngredientChange(index, "ingredient", e.target.value)}
                    className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select ingredient</option>
                    {ingredientsList.map((ing) => (
                      <option key={ing.id} value={ing.name}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                    placeholder="Amount"
                    className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={ingredient.measureUnit}
                    onChange={(e) => handleIngredientChange(index, "measureUnit", e.target.value)}
                    placeholder="Unit"
                    className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                onClick={addIngredientLine}
                className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Add Ingredient
                <Plus size={20} />
              </button>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Next Step
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Instructions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Video Link *</label>
                <input
                  type="url"
                  value={recipeData.videoLink}
                  onChange={(e) => setRecipeData({ ...recipeData, videoLink: e.target.value })}
                  placeholder="Enter video URL"
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-gray-300">Steps *</label>
                {recipeData.steps.map((step, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-gray-300">Step {step.stepNumber}</div>
                    <textarea
                      value={step.instruction}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      placeholder={`Enter instructions for step ${step.stepNumber}`}
                      rows={3}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={addStep}
                className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Add Step
                <Plus size={20} />
              </button>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Create Recipe
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateRecipesModal;