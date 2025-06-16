import Header from "../components/common/Header";
import RecipesTable from "../components/recipe/RecipesTable";

const RecipesPage = () => {
    return (
        <div className='flex-1 flex flex-col h-screen overflow-hidden'>
            <div className="sticky top-0 z-20">
                <Header title='Recipes' />
            </div>
            <main className='flex-1 overflow-y-auto'>
                <div className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    <RecipesTable />
                </div>
            </main>
        </div>
    );
}

export default RecipesPage;