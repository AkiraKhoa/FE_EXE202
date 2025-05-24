import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Star, Plus, CheckCheckIcon, CheckCheck, BookCheck } from "lucide-react";
import axios from "axios";

const EditRecipeModal = ({ recipeId, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipeData, setRecipeData] = useState({
    recipeName: "",
    meals: "",
    difficultyEstimation: 0,
    timeEstimation: 0,
    nation: "",
    ingredients: [],
    instructionVideoLink: "",
    steps: [],
  });

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch recipe data when modal opens
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/Recipes/${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Clean up the ingredients data
        const cleanedIngredients = response.data.ingredients.map((ing) => ({
          ingredient: ing.ingredient,
          // Extract only the numeric part if amount includes the unit
          amount: ing.amount.toString().split(" ")[0],
          defaultUnit: ing.defaultUnit,
        }));

        const initialData = {
          ...response.data,
          steps: response.data.steps || [],
          ingredients: cleanedIngredients,
        };

        setRecipeData(initialData);
        setOriginalData(JSON.stringify(initialData)); // Store original data as string
        setIsLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch recipe details"
        );
        setIsLoading(false);
      }
    };

    fetchRecipeData();
  }, [recipeId]);

  // Check for changes in recipeData
  useEffect(() => {
    if (originalData) {
      const currentData = JSON.stringify(recipeData);
      setHasChanges(currentData !== originalData);
    }
  }, [recipeData, originalData]);

  // Fetch ingredients list for step 2
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/Ingredients`
        );
        setIngredientsList(response.data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        setError("Failed to fetch ingredients");
      }
    };

    if (currentStep === 2) {
      fetchIngredients();
    }
  }, [currentStep]);

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

  // Validation functions
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

  // Navigation handlers
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const handleNext = async () => {
    if (currentStep === 1 && validateFirstStep()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateSecondStep()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateThirdStep()) {
      try {
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Clean up the data before sending
        const submissionData = {
          ...recipeData,
          ingredients: recipeData.ingredients.map((ing) => ({
            ingredient: ing.ingredient,
            amount: ing.amount.toString().split(" ")[0], // Ensure clean numeric value
            defaultUnit: ing.defaultUnit,
          })),
        };

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/Recipes/${recipeId}`,
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Recipe updated:", response.data);
        onSave(response.data);
        onClose();
      } catch (err) {
        console.error("Error updating recipe:", err);
        setError(err.response?.data?.message || "Failed to update recipe");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/Recipes/${recipeId}`,
        recipeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ingredient handlers
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipeData.ingredients];

    if (field === "ingredient") {
      const selectedIngredient = ingredientsList.items?.find(
        (ing) => ing.ingredientName === value
      );
      if (selectedIngredient) {
        newIngredients[index] = {
          ...newIngredients[index],
          ingredient: selectedIngredient.ingredientName,
          defaultUnit: selectedIngredient.defaultUnit,
        };
      }
    } else if (field === "amount") {
      // Ensure amount is stored as a number without the unit
      const numericValue = value.toString().split(" ")[0]; // Split in case there's a unit attached
      newIngredients[index] = {
        ...newIngredients[index],
        amount: numericValue,
      };
    }

    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, ingredients: newIngredients });
  };

  // Step handlers
  const handleStepChange = (index, value) => {
    const newSteps = [...recipeData.steps];
    newSteps[index].instruction = value;
    setRecipeData({ ...recipeData, steps: newSteps });
  };

  const handleDeleteStep = (index) => {
    const newSteps = recipeData.steps.filter((_, i) => i !== index);
    const updatedSteps = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));
    setRecipeData({ ...recipeData, steps: updatedSteps });
  };

  const addStep = () => {
    const newStepNumber = recipeData.steps.length + 1;
    setRecipeData({
      ...recipeData,
      steps: [
        ...recipeData.steps,
        { stepNumber: newStepNumber, instruction: "" },
      ],
    });
  };

  const addIngredientLine = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [
        ...recipeData.ingredients,
        { ingredient: "", amount: "", defaultUnit: "" },
      ],
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

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
              <h2 className="text-xl font-semibold text-white">Edit Recipe</h2>
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
                    onClick={hasChanges ? handleNext : undefined}
                    className={`flex-1 px-4 py-2 ${
                      hasChanges
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-600 cursor-not-allowed"
                    } text-white rounded-lg flex items-center justify-center gap-2 transition-colors`}
                    disabled={!hasChanges}
                  >
                    {hasChanges ? (
                      <>
                        Update Recipe
                        <BookCheck size={20} />
                      </>
                    ) : (
                      <>
                        Nothing to Update
                        <X size={20} />
                      </>
                    )}
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

export default EditRecipeModal;
