(begin
 (define fact 
       (lambda (x) 
           (if (= x 0) 
               1 
               (* x (fact (- x 1)))))
 )
 (alert (fact 0))
 (alert (fact 1))
 (alert (fact 2))
)
