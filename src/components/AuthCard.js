const AuthCard = ({ logo, children }) => (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
         <div className="w-full sm:max-w-md px-6">
            {logo}
        </div>
        

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white overflow-hidden sm:rounded-lg">
            {children}
        </div>
    </div>
)

export default AuthCard
