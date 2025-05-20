import Header from "../components/common/Header";
import RecipesTable from "../components/recipe/RecipesTable";

const RecipesPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Recipes' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* CRUD USERS */}
                <RecipesTable />

            </main>
        </div>
    );
}

export default RecipesPage