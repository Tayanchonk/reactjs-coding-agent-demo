export const ProgressIndicator = ({ progress }: { progress: number }) => {
    let bg = "bg-[#E3E8EC]"
    switch (progress) {
        case 1:
            bg = "bg-[#ff6961]"
            break;
        case 2:
            bg = "bg-[#FF9500]"
            break;
        case 3:
            bg = "bg-[#FFCC00]"
            break;
        case 4:
            bg = "bg-[#3DD39B]"
            break;
    }
    return (
        <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
                <div
                    key={index}
                    className={`h-[6px] rounded-[2px] ${index < progress ? bg : "bg-[#E3E8EC]"}
              }`}
                ></div>
            ))}
        </div>
    );
};