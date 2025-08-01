export default function Video() {
    return (
        <div className="flex items-center justify-center sm:my-20 w-full">
            <div className="flex flex-col">
                <div className="flex items-center justify-center flex-wrap">
                    <h1 className="text-center sm:text-4xl text-3xl font-semibold sm:my-4 sm:w-full w-80">
                        Create Music as a starting point
                    </h1>
                </div>
                <div className="sm:my-10 my-4">
                    <iframe 
                        src="https://www.youtube.com/embed/rgRZUF_qjsY?si=1xi0QUJxU3avzNn1" 
                        allowFullScreen 
                        className="rounded-md sm:w-[1280px] sm:h-[800px] w-full h-52" 
                    />
                </div>
            </div>
        </div>
    )
}