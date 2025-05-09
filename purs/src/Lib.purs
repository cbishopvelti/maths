module Lib where

import Prelude
import Effect (Effect)
import Effect.Console (log)

greeting :: String
greeting = "Hello from PureScript 5!"

add :: Int -> Int -> Int
add x y = x + y

logGreeting :: Effect Unit
logGreeting = log greeting
