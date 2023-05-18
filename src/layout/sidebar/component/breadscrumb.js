import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { useLocation } from "react-router-dom";

export function Breadcrumbs() {
    const location = useLocation();
    const pathList = location.pathname.split('/')
    .filter(crumb => !!crumb);
  
    const pathLinks = pathList.reduce((pre, curr, index) => {
      console.log(curr);
      return [...pre , index ? pre[index - 1] + "/" + curr : "/" + curr];
    }, []);
    return (
      <Breadcrumb>
        {pathList
          .map((crumb,index) => {
            return(
              <BreadcrumbItem className={pathLinks[index] === location.pathname ? "path active-link" : "path" } 
              key={crumb} 
              href={pathLinks[index]}>
                {crumb}
              </BreadcrumbItem>
            )
        })}
      </Breadcrumb>
    );
  }