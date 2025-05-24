import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Star, Plus, CheckCircle } from "lucide-react";
import axios from "axios";

const CreateRecipesModal = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipeData, setRecipeData] = useState({
    recipeName: "",
    meals: "",
    difficultyEstimation: 0,
    timeEstimation: 0, // Changed from string to number
    nation: "",
    ingredients: [{ ingredient: "", amount: "", defaultUnit: "" }],
    instructionVideoLink: "",
    steps: [{ stepNumber: 1, instruction: "" }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleChange = (e) => {
    const value =
      e.target.type === "number" || e.target.name === "timeEstimation"
        ? Number(e.target.value)
        : e.target.value;

    setRecipeData({
      ...recipeData,
      [e.target.name]: value,
    });
  };

  const handleStarClick = (rating) => {
    setRecipeData({
      ...recipeData,
      difficultyEstimation: Number(rating),
    });
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((rating) => (
      <button
        key={rating}
        type="button"
        onClick={() => handleStarClick(rating)}
        onMouseEnter={() => setHoveredRating(rating)}
        onMouseLeave={() => setHoveredRating(0)}
        className="focus:outline-none transform transition-transform hover:scale-110"
      >
        <Star
          size={24}
          className={`${
            rating <= (hoveredRating || recipeData.difficultyEstimation)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-600"
          } cursor-pointer transition-all duration-200`}
        />
      </button>
    ));
  };

  const validateFirstStep = () => {
    if (
      !recipeData.recipeName ||
      !recipeData.meals ||
      !recipeData.timeEstimation ||
      !recipeData.nation
    ) {
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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/Ingredients`
        );
        setIngredientsList(response.data); // Now contains items, page, pageSize, etc.
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        setError("Failed to fetch ingredients");
      }
    };

    if (currentStep === 2) {
      fetchIngredients();
    }
  }, [currentStep]);

  // Handle ingredient change
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeData.ingredients];
    if (field === "ingredient") {
      const selectedIngredient = ingredientsList.items.find(
        (ing) => ing.ingredientName === value
      );
      if (selectedIngredient) {
        newIngredients[index] = {
          ...newIngredients[index],
          ingredient: selectedIngredient.ingredientName,
          defaultUnit: selectedIngredient.defaultUnit,
        };
      }
    } else {
      newIngredients[index][field] = value;
    }
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  // Add new ingredient line
  const addIngredientLine = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [
        ...recipeData.ingredients,
        { ingredient: "", amount: "", defaultUnit: "" },
      ],
    });
  };

  // Validate second step
  const validateSecondStep = () => {
    const hasEmptyFields = recipeData.ingredients.some(
      (ing) => !ing.ingredient || !ing.amount || !ing.defaultUnit
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
      steps: [
        ...recipeData.steps,
        { stepNumber: newStepNumber, instruction: "" },
      ],
    });

    // Scroll within the modal container
    setTimeout(() => {
      const elements = modalContainer.querySelectorAll("textarea");
      const lastElement = elements[elements.length - 1];
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Handle step instruction change
  const handleStepChange = (index, value) => {
    const newSteps = [...recipeData.steps];
    newSteps[index].instruction = value;
    setRecipeData({ ...recipeData, steps: newSteps });
  };

  // Validate third step
  const validateThirdStep = () => {
    if (!recipeData.instructionVideoLink) {
      setError("Please provide a video link");
      return false;
    }
    const hasEmptySteps = recipeData.steps.some((step) => !step.instruction);
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

  const handleNext = async () => {
    if (currentStep === 1 && validateFirstStep()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && validateSecondStep()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3 && validateThirdStep()) {
      try {
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/Recipes`,
          recipeData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Recipe created:", response.data);
        onSave(response.data);
        onClose();
      } catch (err) {
        console.error("Error creating recipe:", err);
        setError(err.response?.data?.message || "Failed to create recipe");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Add these functions after other state declarations
  const handleDeleteIngredient = (index) => {
    const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  const handleDeleteStep = (index) => {
    const newSteps = recipeData.steps.filter((_, i) => i !== index);
    // Recalculate step numbers
    const updatedSteps = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));
    setRecipeData({ ...recipeData, steps: updatedSteps });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none pb-[120px]">
          <motion.div
            className="relative bg-gray-800 rounded-xl p-6 w-[500px] shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pointer-events-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                Create Recipe
              </h2>
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
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 1 ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  1
                </div>
                <div className="ml-2 text-sm text-gray-300">
                  Recipe Information
                </div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 2 ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  2
                </div>
                <div className="ml-2 text-sm text-gray-300">Ingredients</div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === 3 ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
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
                  <label className="block text-gray-300 mb-1">
                    Recipe Name *
                  </label>
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
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">
                    Difficulty Estimation *
                  </label>
                  <div className="flex gap-1">{renderStars()}</div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">
                    Time Estimation (in minutes) *
                  </label>
                  <input
                    type="number"
                    name="timeEstimation"
                    value={recipeData.timeEstimation}
                    onChange={handleChange}
                    min="1"
                    placeholder="Enter preparation time"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">
                    Nation/Region *
                  </label>
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
                {recipeData.ingredients.map((ingredient, index) => {
                  // Filter out already selected ingredients
                  const availableIngredients = ingredientsList.items?.filter(
                    (ing) =>
                      !recipeData.ingredients.some(
                        (existing, i) =>
                          i !== index &&
                          existing.ingredient === ing.ingredientName
                      )
                  );

                  return (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={ingredient.ingredient}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "ingredient",
                            e.target.value
                          )
                        }
                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select ingredient</option>
                        {availableIngredients?.map((ing) => (
                          <option
                            key={ing.ingredientId}
                            value={ing.ingredientName}
                          >
                            {ing.ingredientName}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={ingredient.amount}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                        placeholder="Amount"
                        className="w-32 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="w-16 h-10 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center truncate">
                        {ingredient.defaultUnit}
                      </div>
                      <button
                        onClick={() => handleDeleteIngredient(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  );
                })}
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
                  <label className="block text-gray-300 mb-1">
                    Video Link *
                  </label>
                  <input
                    type="url"
                    value={recipeData.instructionVideoLink}
                    onChange={(e) =>
                      setRecipeData({
                        ...recipeData,
                        instructionVideoLink: e.target.value,
                      })
                    }
                    placeholder="Enter video URL"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-gray-300">Steps *</label>
                  {recipeData.steps.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-300">
                          Step {step.stepNumber}
                        </div>
                        <button
                          onClick={() => handleDeleteStep(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <input
                        value={step.instruction}
                        onChange={(e) =>
                          handleStepChange(index, e.target.value)
                        }
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
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    Create Recipe
                    <CheckCircle size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateRecipesModal;
