(begin
  (define fibonacci
     (lambda (x)
      (if (= x 1)
          1
          (if (= x 0)
              0
              (+ (fibonacci (- x 1)) (fibonacci (- x 2 )))
          )
      )
     )

  )
  (alert (fibonacci 0))
  (alert (fibonacci 1))
  (alert (fibonacci 2))
  (alert (fibonacci 3))
  (alert (fibonacci 4))
  (alert (fibonacci 5))
  (alert (fibonacci 6))
 
)
