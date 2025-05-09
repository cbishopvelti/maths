module Main where

import Prelude

import Effect (Effect)
import Effect.Console (log)
import Data.Tuple (Tuple(..))

main :: Effect Unit
main = do
  log "🍝2"

test :: Int -> Int
test x = x + 5


-- equations
type LinearEquation = {
    m :: Number,
    c :: Number
}

type Vec = Tuple Number Number

solve :: LinearEquation -> LinearEquation -> Vec
solve {m: m1, c: c1} {m: m2, c: c2} =
    let
        -- Calculate x: x = (c2 - c1) / (m1 - m2)
        xIntersection :: Number
        xIntersection = (c2 - c1) / (m1 - m2)

        -- Calculate y using the first equation: y = m1*x + c1
        yIntersection :: Number
        yIntersection = m1 * xIntersection + c1
    in
        Tuple xIntersection yIntersection -- This constructs a Vec
