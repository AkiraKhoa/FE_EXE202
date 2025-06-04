import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Star, Plus, CheckCircle, Edit2, Search } from "lucide-react";
import axios from "axios";

const EditRecipeModal = ({ recipeId, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredientTypes, setIngredientTypes] = useState([]);
  const [ingredientsList, setIngredientsList] = useState({});
  const [recipeData, setRecipeData] = useState({
    recipeName: "",
    meals: "",
    difficultyEstimation: 0,
    timeEstimation: 0,
    cuisineId: 0,
    ingredients: [],
    instructionVideoLink: "",
    steps: [{ stepNumber: 1, instruction: "" }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState(0);
  const [selectedTypeName, setSelectedTypeName] = useState("");
  const [editingIngredientIndex, setEditingIngredientIndex] = useState(null);
  const [searchTypeTerm, setSearchTypeTerm] = useState("");
  const [searchIngredientTerm, setSearchIngredientTerm] = useState("");

  // Fetch recipe data and ingredient types when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        // Fetch recipe data
        const recipeResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/Recipes/${recipeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Map ingredients to include typeId and typeName (assuming API returns them)
        const cleanedIngredients = recipeResponse.data.ingredients.map((ing) => ({
          typeId: ing.typeId || 0,
          typeName: ing.typeName || "",
          ingredient: ing.ingredient,
          amount: String(ing.amount).split(" ")[0], // Extract numeric part
          defaultUnit: ing.defaultUnit,
        }));

        // Map steps to ensure stepNumber is correct
        const cleanedSteps = (recipeResponse.data.steps || []).map((step, index) => ({
          stepNumber: index + 1,
          instruction: step.instruction || "",
        }));

        setRecipeData({
          recipeName: recipeResponse.data.recipeName || "",
          meals: recipeResponse.data.meals || "",
          difficultyEstimation: Number(recipeResponse.data.difficultyEstimation) || 0,
          timeEstimation: Number(recipeResponse.data.timeEstimation) || 0,
          cuisineId: Number(recipeResponse.data.cuisineId) || 0,
          ingredients: cleanedIngredients,
          instructionVideoLink: recipeResponse.data.instructionVideoLink || "",
          steps: cleanedSteps.length > 0 ? cleanedSteps : [{ stepNumber: 1, instruction: "" }],
        });

        // Fetch ingredient types
        const typesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/Ingredients/ingredient-types?page=1&pageSize=20`
        );
        setIngredientTypes(typesResponse.data.items || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch recipe details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [recipeId]);

  // Fetch ingredients when selecting an ingredient type
  const fetchIngredientsByType = async (typeId) => {
    if (!typeId || ingredientsList[typeId]) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/Ingredients/ingredients?typeId=${typeId}&page=1&pageSize=20`
      );
      setIngredientsList((prev) => ({
        ...prev,
        [typeId]: response.data.items || [],
      }));
    } catch (err) {
      setError(`Failed to fetch ingredients for type ${typeId}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "timeEstimation" || name === "cuisineId" ? Number(value) : value;
    setRecipeData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleStarClick = (rating) => {
    setRecipeData((prev) => ({
      ...prev,
      difficultyEstimation: Number(rating),
    }));
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

  const handleAddOrEditIngredient = (index = null) => {
    setEditingIngredientIndex(index);
    if (index !== null) {
      const ingredient = recipeData.ingredients[index];
      setSelectedTypeId(ingredient.typeId);
      setSelectedTypeName(ingredient.typeName);
      fetchIngredientsByType(ingredient.typeId);
      setShowIngredientModal(true); // Go directly to ingredient selection
    } else {
      setShowTypeModal(true);
    }
    setSearchTypeTerm("");
    setSearchIngredientTerm("");
  };

  const handleSelectType = (typeId, typeName) => {
    setSelectedTypeId(typeId);
    setSelectedTypeName(typeName);
    fetchIngredientsByType(typeId);
    setShowTypeModal(false);
    setShowIngredientModal(true);
    setSearchIngredientTerm("");
  };

  const handleSelectIngredient = (ingredient) => {
    const newIngredient = {
      typeId: selectedTypeId,
      typeName: selectedTypeName,
      ingredient: ingredient.ingredientName,
      amount: editingIngredientIndex !== null ? recipeData.ingredients[editingIngredientIndex]?.amount || "" : "",
      defaultUnit: ingredient.defaultUnit,
    };

    if (editingIngredientIndex !== null) {
      const newIngredients = [...recipeData.ingredients];
      newIngredients[editingIngredientIndex] = newIngredient;
      setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
    } else {
      setRecipeData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient],
      }));
    }

    setShowIngredientModal(false);
    setSelectedTypeId(0);
    setSelectedTypeName("");
    setEditingIngredientIndex(null);
  };

  const handleIngredientAmountChange = (index, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index].amount = value;
    setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
    setRecipeData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...recipeData.steps];
    newSteps[index].instruction = value;
    setRecipeData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addStep = () => {
    const newStepNumber = recipeData.steps.length + 1;
    setRecipeData((prev) => ({
      ...prev,
      steps: [...prev.steps, { stepNumber: newStepNumber, instruction: "" }],
    }));
  };

  const handleDeleteStep = (index) => {
    const newSteps = recipeData.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepNumber: i + 1 }));
    setRecipeData((prev) => ({ ...prev, steps: newSteps }));
  };

  const validateFirstStep = () => {
    if (!recipeData.recipeName) {
      setError("Recipe name is required");
      return false;
    }
    if (!recipeData.meals) {
      setError("Meal type is required");
      return false;
    }
    if (recipeData.timeEstimation <= 0) {
      setError("Time estimation must be greater than 0");
      return false;
    }
    if (recipeData.difficultyEstimation < 1 || recipeData.difficultyEstimation > 5) {
      setError("Difficulty estimation must be between 1 and 5");
      return false;
    }
    if (!recipeData.cuisineId) {
      setError("Region is required");
      return false;
    }
    setError(null);
    return true;
  };

  const validateSecondStep = () => {
    setError(null);
    return true;
  };

  const validateThirdStep = () => {
    if (!recipeData.instructionVideoLink || !/^https?:\/\/.+$/.test(recipeData.instructionVideoLink)) {
      setError("A valid video URL is required");
      return false;
    }
    if (recipeData.steps.length === 0) {
      setError("At least one step is required");
      return false;
    }
    const hasInvalidStep = recipeData.steps.some((step) => !step.instruction);
    if (hasInvalidStep) {
      setError("All step instructions must be filled");
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

        const requestData = {
          recipeId: recipeId,
          recipeName: recipeData.recipeName,
          meals: recipeData.meals,
          difficultyEstimation: recipeData.difficultyEstimation,
          timeEstimation: recipeData.timeEstimation,
          cuisineId: recipeData.cuisineId,
          ingredients: recipeData.ingredients.map((ing) => ({
            ingredient: ing.ingredient,
            amount: String(ing.amount),
            defaultUnit: ing.defaultUnit,
          })),
          instructionVideoLink: recipeData.instructionVideoLink,
          steps: recipeData.steps.map((step, index) => ({
            stepNumber: index + 1,
            instruction: step.instruction,
          })),
        };

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/Recipes/${recipeId}`,
          requestData,
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
    }
  };

  const filteredIngredientTypes = ingredientTypes.filter((type) =>
    type.typeName.toLowerCase().includes(searchTypeTerm.toLowerCase())
  );

  const filteredIngredients = ingredientsList[selectedTypeId]?.filter((ingredient) =>
    ingredient.ingredientName.toLowerCase().includes(searchIngredientTerm.toLowerCase())
  ) || [];

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
            className="relative bg-gray-800 rounded-xl p-6 w-[600px] shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pointer-events-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Edit Recipe</h2>
              <button className="text-gray-400 hover:text-white" onClick={onClose}>
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
                <div className="ml-2 text-sm text-gray-300">Recipe Information</div>
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
                  <label className="block text-gray-300 mb-1">Recipe Name *</label>
                  <input
                    type="text"
                    name="recipeName"
                    value={recipeData.recipeName}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter recipe name"
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
                  <label className="block text-gray-300 mb-1">Difficulty Estimation *</label>
                  <div className="flex gap-1">{renderStars()}</div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Time Estimation (minutes) *</label>
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
                  <label className="block text-gray-300 mb-1">Region *</label>
                  <select
                    name="cuisineId"
                    value={recipeData.cuisineId}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="0">Select a region</option>
                    <option value="1">Northern</option>
                    <option value="2">Central</option>
                    <option value="3">Southern</option>
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
                {recipeData.ingredients.length === 0 ? (
                  <div className="text-gray-400 text-center">No ingredients added yet.</div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {recipeData.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="text-sm text-gray-300">{ingredient.typeName || "Unknown Type"}</div>
                          <div className="text-white">{ingredient.ingredient}</div>
                        </div>
                        <input
                          type="number"
                          value={ingredient.amount}
                          onChange={(e) => handleIngredientAmountChange(index, e.target.value)}
                          placeholder="Amount"
                          className="w-24 p-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          min="0"
                        />
                        <div className="w-16 p-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center truncate">
                          {ingredient.defaultUnit}
                        </div>
                        <button
                          onClick={() => handleAddOrEditIngredient(index)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteIngredient(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => handleAddOrEditIngredient()}
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
                    value={recipeData.instructionVideoLink}
                    onChange={(e) =>
                      setRecipeData((prev) => ({
                        ...prev,
                        instructionVideoLink: e.target.value,
                      }))
                    }
                    placeholder="Enter video URL (e.g., https://example.com)"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-gray-300">Steps *</label>
                  {recipeData.steps.map((step, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-300">Step {step.stepNumber}</div>
                        <button
                          onClick={() => handleDeleteStep(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
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
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      isSubmitting
                        ? "bg-green-700 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Update Recipe
                        <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Pop-up for IngredientType */}
          {showTypeModal && (
            <motion.div
              className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm pointer-events-auto" />
              <motion.div
                className="relative bg-gray-800 rounded-xl p-6 w-[900px] max-w-[95vw] max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pointer-events-auto border border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Select Ingredient Type</h3>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => {
                      setShowTypeModal(false);
                      setEditingIngredientIndex(null);
                      setSearchTypeTerm("");
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search types..."
                    value={searchTypeTerm}
                    onChange={(e) => setSearchTypeTerm(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {filteredIngredientTypes.length === 0 ? (
                    <div className="col-span-3 text-gray-400 text-center">
                      {searchTypeTerm ? "No matching ingredient types found" : "No ingredient types available"}
                    </div>
                  ) : (
                    filteredIngredientTypes.map((type) => (
                      <button
                        key={type.ingredientTypeId}
                        className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-center transition-colors"
                        onClick={() => handleSelectType(type.ingredientTypeId, type.typeName)}
                      >
                        {type.typeName}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Pop-up for Ingredient */}
          {showIngredientModal && (
            <motion.div
              className="fixed inset-0 z-70 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm pointer-events-auto" />
              <motion.div
                className="relative bg-gray-800 rounded-xl p-6 w-[900px] max-w-[95vw] max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pointer-events-auto border border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Select Ingredient</h3>
                  <div className="flex gap-2">
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={() => {
                        setShowIngredientModal(false);
                        setShowTypeModal(true);
                        setSearchIngredientTerm("");
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={() => {
                        setShowIngredientModal(false);
                        setSelectedTypeId(0);
                        setSelectedTypeName("");
                        setEditingIngredientIndex(null);
                        setSearchIngredientTerm("");
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchIngredientTerm}
                    onChange={(e) => setSearchIngredientTerm(e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {filteredIngredients.length === 0 ? (
                    <div className="col-span-3 text-gray-400 text-center">
                      {searchIngredientTerm
                        ? "No matching ingredients found"
                        : "No ingredients available for this type"}
                    </div>
                  ) : (
                    filteredIngredients.map((ingredient) => (
                      <button
                        key={ingredient.ingredientId}
                        className="p-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors flex flex-col items-center"
                        onClick={() => handleSelectIngredient(ingredient)}
                      >
                        <span className="text-center">{ingredient.ingredientName}</span>
                        <span className="text-gray-400 text-sm mt-1">{ingredient.defaultUnit}</span>
                      </button>
                    ))
                  )}
                </div>
                <button
                  className="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  onClick={() => {
                    setShowIngredientModal(false);
                    setSelectedTypeId(0);
                    setSelectedTypeName("");
                    setEditingIngredientIndex(null);
                    setSearchIngredientTerm("");
                  }}
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditRecipeModal;