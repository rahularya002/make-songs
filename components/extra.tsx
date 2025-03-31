export default function Extra () {
    return(
        <div className="sm:flex items-center jstify-center w-full sm:p-20 sm:my-20 my-10 hidden">
            <div className="flex flex-col items-center w-full">
                <h1 className="text-4xl font-semibold my-10 text-center">Lets Create Some Music!!</h1>
                <div className="shadow-primary-glow sm:my-20 ">
                    <button className="text-2xl font semibold bg-primary border border-primary rounded-md py-5 px-8 text-white hover:bg-white hover:text-primary transition-all duration-300 dark:bg-primary dark:text-white">Create your first song</button>
                </div>
            </div>
        </div>
    )
}