import { GridPattern } from "../../ui/GridPattern";
import { cn } from "../../../utils";

const Background = () => {
  return (
    <div className="hidden md:block w-1/2 h-[550px] relative overflow-hidden border-r border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100">
        <GridPattern
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-50%] h-[200%] skew-y-12"
          )}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
          <h2 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Enspeek
          </h2>
          <p className="text-sm text-center text-gray-600 max-w-xs">
            Enspeek enables human-like interactions between users and
            machines through natural language understanding and response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Background;
